import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { fromHex, toHex } from "viem";

// Importing and initializing DB
const { Database } = require("node-sqlite3-wasm");

import { Event, EventPayload } from "./interface";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

// Instatiate Database
const db = new Database("database.db");
db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, name TEXT)");

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<string>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data.payload;
  try {
    const eventPayload = JSON.parse(fromHex(payload, "string")) as Event;
    console.log(
      `Managing user ${eventPayload.id}/${eventPayload.title} - ${eventPayload.action}`
    );
    if (!eventPayload.action) throw new Error("No action provided");
    if (eventPayload.action === "add")
      db.run("INSERT INTO events VALUES (?, ?)", [
        eventPayload.id,
        eventPayload.title,
        eventPayload.date,
        eventPayload.location,
        eventPayload.prices,
        eventPayload.capacity,
        eventPayload.organizer,
        eventPayload.dao,
        eventPayload.referral,
        eventPayload.status,
        eventPayload.minReferrals,
        eventPayload.referralDiscount,
        eventPayload.participants,
        eventPayload.tokenUrl,
      ]);
    if (eventPayload.action === "delete")
      db.run("DELETE FROM events WHERE id = ?", [eventPayload.id]);

    const advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });
    console.log("Received notice status ", await advance_req.text());
    return "accept";
  } catch (e) {
    console.log(`Error executing parameters: "${payload}"`);
    return "reject";
  }
};

const handleInspect: InspectRequestHandler = async (data) => {
  const payload = data.payload;
  console.log("Received inspect request data " + JSON.stringify(data));
  try {
    const eventPayload = JSON.parse(fromHex(payload, "string")) as EventPayload;
    if (!eventPayload.action) throw new Error("No action provided");

    if (eventPayload.action == "get") {
      const event = await db.get(
        `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
      );
      const payload = toHex(JSON.stringify(event));
      const inspect_req = await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });
      console.log("Received report status " + inspect_req.status);
      return "accept";
    }
    if (eventPayload.action == "get_all") {
      const listOfEvents = await db.all(`SELECT * FROM events`);
      const payload = toHex(JSON.stringify(listOfEvents));
      const inspect_req = await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });
      console.log("Received report status " + inspect_req.status);
      return "accept";
    } else {
      return "invalid";
    }
  } catch (e) {
    console.log(`Error generating report with binary value "${data.payload}"`);
    return "reject";
  }
};

const main = async () => {
  const { POST } = createClient<paths>({ baseUrl: rollupServer });
  let status: RequestHandlerResult = "accept";
  while (true) {
    const { response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });

    if (response.status === 200) {
      const data = (await response.json()) as RollupsRequest;
      switch (data.request_type) {
        case "advance_state":
          status = await handleAdvance(data.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(data.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
