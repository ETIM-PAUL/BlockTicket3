import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { generate_code } from "./utils";
import { fromHex, hexToString, toHex } from "viem";
import { Router } from "cartesi-router";
// Importing and initializing DB
import { Database } from "node-sqlite3-wasm";
// @ts-ignore
import { CheckActions } from "./checks";
import { Wallet, Error_out } from "cartesi-wallet";

// @ts-ignore
import { initialize, protocolVersion } from "@dao-library/core/dao";
// @ts-ignore
import { createProposal, getActionObject } from "@dao-library/core/proposal";

import { Event, EventPayload, EventStatus } from "./interface";

const rollup_server =
  process.env.ROLLUP_HTTP_SERVER_URL ??
  "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE";
const SYSTEM_ADMINS = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];
const wallet = new Wallet(new Map());
const check_actions = new CheckActions(wallet);
const router = new Router(wallet);
// Instatiate Database
const db = new Database("database.db");
db.run(
  "CREATE TABLE IF NOT EXISTS events (id INTEGER AUTO_INCREMENT PRIMARY KEY, title TEXT, date TEXT, location TEXT, tickets TEXT, capacity INTEGER, organizer TEXT, dao BOOLEAN, referral BOOLEAN, status INTEGER, minReferrals INTEGER, referralDiscount INTEGER, tokenUrl TEXT, logoUrl TEXT  )"
);

//create event_tickets table
db.run(
  "CREATE TABLE IF NOT EXISTS event_tickets (id INTEGER AUTO_INCREMENT PRIMARY KEY, event_id INTEGER, ticket_data text  )"
);
//create event_referrals table
db.run(
  "CREATE TABLE IF NOT EXISTS event_referrals (id INTEGER AUTO_INCREMENT PRIMARY KEY, code INTEGER, event_id INTEGER, owner text, count INTEGER  )"
);
//create event_proposals table
db.run(
  "CREATE TABLE IF NOT EXISTS event_tickets (id INTEGER AUTO_INCREMENT PRIMARY KEY, event_id INTEGER, ticket_data text  )"
);
//create event_creation_prices table
db.run(
  "CREATE TABLE IF NOT EXISTS event_creation_prices (id INTEGER AUTO_INCREMENT PRIMARY KEY, name TEXT, price INTEGER  )"
);

//insert into event_creation_prices table
const event_creation_price: Array<{ name: string; price: number }> = [
  { name: "neutral", price: 2e16 },
  { name: "dao_based", price: 4e16 },
  { name: "referral_based", price: 6e16 },
  { name: "full_package", price: 1e17 },
];
for (let index = 0; index < event_creation_price.length; index++) {
  const element = event_creation_price[index];
  if (element) {
    db.run("INSERT INTO event_creation_prices VALUES (NULL, :n, :p)", {
      ":n": element?.name,
      ":p": element?.price,
    });
  }
}

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<string>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

let DAPP_ADDRESS: any =
  "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C".toLowerCase();
console.log("HTTP rollup_server url is " + rollup_server);

const handleAdvance: any = async (data: any) => {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data.payload;
  let processed = false;
  if (
    String(data.metadata.msg_sender).toLowerCase() ===
    rollup_server.toLowerCase()
  ) {
    console.log("setting Dapp address:", payload);
    DAPP_ADDRESS = payload;
  }
  const msg_sender = data.metadata.msg_sender.toLowerCase();

  try {
    let eventPayload: any;
    if (msg_sender !== "0xffdbe43d4c855bf7e0f105c400a50857f53ab044") {
      eventPayload = JSON.parse(fromHex(payload, "string")) as Event;

      if (!eventPayload.action) throw new Error("No action provided");
      if (eventPayload.action === "create_event") {
        const listOfEventTypes = await db.all(
          `SELECT * FROM event_creation_prices`
        );

        // // const tx = await ...
        // // rollups.etherPortalContract.depositEther(propos.dappAddress,data,txOverrides);
        // const amount = BigInt(eventPayload.ether_amount);
        // const hexString = amount.toString(16).padStart(64, "0");
        // const result = wallet.ether_deposit_process(
        //   `${DAPP_ADDRESS}${hexString}`
        // );
        // const balance = wallet.balance_get(DAPP_ADDRESS);
        // console.log("eth_balance", balance);
        // console.log("eth_deposit_balance", result);

        const create_process = check_actions.create_event(
          eventPayload,
          listOfEventTypes,
          data.metadata.msg_sender,
          DAPP_ADDRESS
        );
        console.log("eventPayload", eventPayload);
        if (create_process) {
          db.run(
            "INSERT INTO events VALUES (NULL, :t, :d, :l, :tickets, :c, :o, :dao, :r, :s, :minR, :discount, :url, :logo)",
            {
              ":t": eventPayload?.title,
              ":d": eventPayload?.date,
              ":l": eventPayload?.location,
              ":tickets": JSON.stringify(eventPayload?.tickets),
              ":c": eventPayload?.capacity,
              ":o": eventPayload?.organizer,
              ":dao": eventPayload?.dao,
              ":r": eventPayload?.referral,
              ":s": EventStatus?.Pending,
              ":minR": eventPayload?.minReferrals,
              ":discount": eventPayload?.referralDiscount,
              ":url": eventPayload?.tokenUrl,
              ":logo": eventPayload?.logoUrl,
            }
          );
          processed = true;
        }
      }

      if (eventPayload.action === "purchase_ticket") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        const event_participants = await db.get(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id} LIMIT 1;`
        );
        if (
          event?.organizer === data.metadata.msg_sender.toLowerCase() ||
          SYSTEM_ADMINS.includes(event?.organizer)
        ) {
          throw new Error("Access Denied");
        } else {
          const referralCodes: any = await db.all(
            `SELECT * FROM event_referrals`
          );
          const event_referrals = referralCodes.filter(
            (referral_code: any) => referral_code.event_id === event?.id
          );
          const ticket_process = check_actions.buy_event_ticket(
            eventPayload.ticket,
            DAPP_ADDRESS,
            JSON.parse(event?.tickets),
            data.metadata.msg_sender,
            event_referrals,
            event,
            event_participants
          );
          if (ticket_process) {
            const generatedCode = generate_code(referralCodes);
            db.run(
              "INSERT INTO event_tickets VALUES (NULL, :event_id, :ticket_data)",
              {
                ":event_id": eventPayload.id,
                ":ticket_data": JSON.stringify(eventPayload.ticket),
              }
            );

            if (event?.referral) {
              if (
                !event_referrals.find(
                  (referral: any) => referral.owner === msg_sender
                )
              ) {
                db.run(
                  "INSERT INTO event_referrals VALUES (NULL, :code, :event_id, :owner, :count)",
                  {
                    ":code": generatedCode,
                    ":event_id": eventPayload.id,
                    ":owner": msg_sender,
                    ":count": 0,
                  }
                );
              }

              if (eventPayload.referral_code) {
                const code_details = check_actions.get_referral_code_details(
                  eventPayload.referral_code
                );
                //if there is a referral code, check if it exist and then increase the count
                db.run(
                  `UPDATE event_referrals SET count = ${code_details.code++}, WHERE code = ${
                    code_details.id
                  };`
                );
              }
            }

            processed = true;
          }
        }
      }

      if (eventPayload.action === "start_event") {
        const event = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        if (event?.organizer === data.metadata.msg_sender.toLowerCase()) {
          if (event?.status === EventStatus.Pending) {
            db.run(
              `UPDATE events SET status = ${EventStatus?.Ongoing}, WHERE id = ${eventPayload.id};`
            );
            processed = true;
          } else
            throw new Error("Event has either ended, cancelled or ongoing");
        } else throw new Error("Access Denied");
      }

      if (eventPayload.action === "cancel_event") {
        const event = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        const event_participants: any = await db.get(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id} LIMIT 1;`
        );
        if (event?.organizer === data.metadata.msg_sender.toLowerCase()) {
          if (event?.status === EventStatus.Pending) {
            db.run(
              `UPDATE events SET status = ${EventStatus?.Cancelled}, WHERE id = ${eventPayload.id};`
            );

            //refund ticket fees to all participants
            for (let index = 0; index < event_participants?.length; index++) {
              const element = JSON.parse(
                event_participants[index]?.ticket_data
              );
              wallet.ether_transfer(
                DAPP_ADDRESS,
                element.participant,
                BigInt(element.type.amount)
              );
            }
            processed = true;
          } else
            throw new Error("Event has either ended, cancelled or ongoing");
        } else throw new Error("Access Denied");
      }

      // if (eventPayload.action === "create_proposal") {
      //   const event = await db.get(
      //     `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
      //   );
      //   const event_participants = await db.get(
      //     `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id} LIMIT 1;`
      //   );
      //   if (
      //     event?.organizer !== data.metadata.msg_sender.toLowerCase() &&
      //     check_actions.isParticipant(msg_sender, event_participants)
      //   ) {
      //     await createProposal(
      //       msg_sender,
      //       { eventId: eventPayload.id, proposal: eventPayload.proposal },
      //       null,
      //       null,
      //       null
      //     );
      //     processed = true;
      //   } else throw new Error("Access Denied");
      // }

      if (eventPayload.action === "delete_proposal") {
        if (SYSTEM_ADMINS.includes(data.metadata.msg_sender.toLowerCase())) {
          db.run("DELETE FROM events WHERE id = ?", [eventPayload.id]);
          processed = true;
        } else throw new Error("Access Denied");
      }
    } else {
      try {
        const deposit: any = router.process("ether_deposit", payload);
        if (deposit?.payload) {
        }
      } catch (error) {
        processed = false;
      }
    }
    if (processed) {
      const advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });
      console.log("Received notice status ", await advance_req.text());
      return "accept";
    } else {
      return "reject";
    }
  } catch (e) {
    console.log(`Error executing parameters: "${e}"`);
    return "reject";
  }
};

const handleInspect: InspectRequestHandler = async (data) => {
  const payload = data.payload;
  console.log("Received inspect request data " + data);
  const eventPayload: any = hexToString(data.payload).split("/");
  // console.log("url is ", url);
  // const eventPayload = JSON.parse(fromHex(payload, "string")) as EventPayload;
  console.log(eventPayload);

  try {
    if (!eventPayload[0]) throw new Error("No action provided");

    if (eventPayload[0] == "get") {
      const event = await db.get(
        `SELECT * FROM events WHERE id = ${eventPayload[1]} LIMIT 1;`
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
    if (eventPayload[0] == "get_all") {
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
    }
    if (eventPayload[0] == "balance") {
      const balance: any = router.process(eventPayload[0], eventPayload[1]);
      const inspect_req = await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: balance?.payload }),
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
  const { POST } = createClient<paths>({ baseUrl: rollup_server });
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
100000000000000000;
