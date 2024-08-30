import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { generate_code } from "./utils";
import {
  encodeFunctionData,
  getAddress,
  hexToBytes,
  hexToString,
  parseEther,
  toHex,
} from "viem";
import { Router, AdvanceRoute } from "cartesi-router";

// Importing and initializing DB
import { Database } from "node-sqlite3-wasm";

// @ts-ignore
import { CheckActions } from "./checks";

import { Wallet, Voucher } from "cartesi-wallet";

//abi of erc721 smart contract on L1
import { erc721abi } from "./erc721";

import { Event, EventStatus } from "./interface";

const rollup_server =
  process.env.ROLLUP_HTTP_SERVER_URL ??
  "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE";

//wallet instance
const wallet = new Wallet(new Map());

//Database instance
// let db = new Database(":memory:");
let db = new Database("/tmp/database.db");

const check_actions = new CheckActions(wallet, db);

//router instance
const router = new Router(wallet);

let event_id: number = 0;
let ticket_id: number = 0;
let proposal_id: number = 0;

//Set up DB tables
db.run(
  "CREATE TABLE IF NOT EXISTS events (id INTEGER AUTO_INCREMENT PRIMARY KEY, title TEXT, date TEXT, location TEXT, tickets TEXT, capacity INTEGER, organizer TEXT, dao BOOLEAN, referral BOOLEAN, status INTEGER, minReferrals INTEGER, referralDiscount INTEGER, tokenUrl TEXT, logoUrl TEXT, totalETHBal INTEGER  )"
);

//create event_tickets table
db.run(
  "CREATE TABLE IF NOT EXISTS event_tickets (id INTEGER AUTO_INCREMENT PRIMARY KEY, event_id INTEGER, ticket_type_id INTEGER, purchased_time TEXT, ticket_type TEXT, address TEXT, refunded BOOLEAN, claimedNFT BOOLEAN )"
);
//create event_referrals table
db.run(
  "CREATE TABLE IF NOT EXISTS event_referrals (id INTEGER AUTO_INCREMENT PRIMARY KEY, code INTEGER, event_id INTEGER, owner TEXT, ticket_id INTEGER, count INTEGER, claimed BOOLEAN  )"
);
//create event_proposals table
db.run(
  "CREATE TABLE IF NOT EXISTS event_proposals (id INTEGER AUTO_INCREMENT PRIMARY KEY, event_id INTEGER, proposal TEXT, proposer TEXT, voters TEXT, upvotes INTEGER, downvotes INTEGER  )"
);
//create event_creation_prices table
db.run(
  "CREATE TABLE IF NOT EXISTS event_creation_prices (id INTEGER AUTO_INCREMENT PRIMARY KEY, name TEXT, price INTEGER  )"
);

//insert into event_creation_prices table
const event_creation_price: Array<{ name: string; price: number }> = [
  { name: "neutral", price: 2e13 },
  { name: "dao_based", price: 4e13 },
  { name: "referral_based", price: 6e13 },
  { name: "full_package", price: 1e14 },
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

class MintNft extends AdvanceRoute {
  execute = (request: any) => {
    this.parse_request(request);
    const payload = JSON.parse(hexToString(request.payload));
    const event_id = payload.event_id;
    const ticket_id = payload.ticket_id;
    const erc721_address = getAddress(payload.erc721_address);
    const call = encodeFunctionData({
      abi: erc721abi,
      functionName: "mintPOAP",
      args: [this.msg_sender, event_id, ticket_id],
    });
    return new Voucher(erc721_address, hexToBytes(call));
  };
}

router.addRoute("mint_nft", new MintNft());

const handleAdvance: AdvanceRequestHandler = async (data: any) => {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data.payload;
  let processed = false;

  const msg_sender = data.metadata.msg_sender.toLowerCase();

  try {
    let eventString: any = hexToString(payload) as any as Event;

    // set dapp address
    if (
      msg_sender === "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE".toLowerCase()
    ) {
      let rollup_address = payload;
      router.set_rollup_address(rollup_address, "ether_withdraw");
      console.log("Setting DApp address");
      return "accept";
    }

    //deposit ethers into the dapp
    if (msg_sender === "0xffdbe43d4c855bf7e0f105c400a50857f53ab044") {
      try {
        router.process("ether_deposit", payload);
        return "accept";
      } catch (error) {
        console.log(error);
        return "reject";
      }
    }

    let eventPayload = JSON.parse(eventString);

    if (
      msg_sender !== "0xffdbe43d4c855bf7e0f105c400a50857f53ab044" &&
      msg_sender !== "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE" &&
      msg_sender !== "0x59b22D57D4f067708AB0c00552767405926dc768"
    ) {
      if (eventPayload?.action === undefined || eventPayload?.action === null)
        throw new Error("No action provided");

      //Creating Event
      if (eventPayload.action === "create_event") {
        const listOfEventTypes = await db.all(
          `SELECT * FROM event_creation_prices`
        );
        const create_process = check_actions.create_event(
          eventPayload,
          listOfEventTypes,
          data.metadata.msg_sender,
          eventPayload.DAPP_ADDRESS.toLowerCase()
        );
        if (create_process) {
          event_id++;
          db.run(
            "INSERT INTO events VALUES (:id, :t, :d, :l, :tickets, :c, :o, :dao, :r, :s, :minR, :discount, :url, :logo, :totalETHBal)",
            {
              ":id": event_id,
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
              ":totalETHBal": 0,
            }
          );
          processed = true;
        }
      }

      //Purchase Ticket
      if (eventPayload.action === "purchase_ticket") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        const event_participants = await db.get(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id} LIMIT 1;`
        );
        if (event?.organizer === data.metadata.msg_sender.toLowerCase()) {
          throw new Error("Access Denied");
        } else {
          const referralCodes: any = await db.all(
            "SELECT * FROM event_referrals WHERE event_id = ?",
            `${eventPayload?.id}`
          );
          const event_referrals = referralCodes.filter(
            (referral_code: any) => referral_code.event_id === event?.id
          );
          const ticket_process = check_actions.buy_event_ticket(
            eventPayload.ticket,
            eventPayload.DAPP_ADDRESS.toLowerCase(),
            JSON.parse(event?.tickets),
            data.metadata.msg_sender,
            referralCodes,
            event,
            event_participants,
            eventPayload?.referral_code
          );
          if (ticket_process) {
            const generatedCode = generate_code(referralCodes);
            ticket_id++;
            db.run(
              "INSERT INTO event_tickets VALUES (:id, :event_id, :ticket_type_id, :purchased_time, :ticket_type, :address, :refunded, :claimedNFT)",
              {
                ":id": ticket_id,
                ":event_id": eventPayload.id,
                ":ticket_type_id": eventPayload.ticket,
                ":purchased_time": eventPayload.purchased_time,
                ":ticket_type": eventPayload.ticket_type,
                ":address": msg_sender,
                ":refunded": false,
                ":claimedNFT": false,
              }
            );

            if (event?.referral) {
              db.run(
                "INSERT INTO event_referrals VALUES (NULL, :code, :event_id, :owner, :ticket_id, :count, :claimed)",
                {
                  ":code": generatedCode,
                  ":event_id": eventPayload.id,
                  ":owner": msg_sender,
                  ":ticket_id": ticket_id,
                  ":count": 0,
                  ":claimed": false,
                }
              );

              if (eventPayload?.referral_code) {
                //if there is a referral code, check if it exist and then increase the count
                const code_details = check_actions.get_referral_code_details(
                  referralCodes,
                  eventPayload.referral_code
                );
                if (code_details) {
                  let increase_count = code_details.count + 1;
                  db.run(
                    `UPDATE event_referrals SET count = ${increase_count} WHERE code = ${code_details.code};`
                  );
                }
              }
            }

            processed = true;
          }
        }
      }

      //Start Event
      if (eventPayload.action === "start_event") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        if (event?.organizer === data.metadata.msg_sender.toLowerCase()) {
          if (event?.status === EventStatus.Pending) {
            db.run(
              `UPDATE events SET status = ${EventStatus?.Ongoing} WHERE id = ${eventPayload.id};`
            );
            processed = true;
          } else throw new Error("Event is either ended, cancelled or ongoing");
        } else throw new Error("Access Denied");
      }

      //End Event
      if (eventPayload.action === "end_event") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        if (event?.organizer === data.metadata.msg_sender.toLowerCase()) {
          if (event && event?.status === EventStatus.Ongoing) {
            db.run(
              `UPDATE events SET status = ${EventStatus?.Ended} WHERE id = ${eventPayload.id};`
            );
            db.run(
              `UPDATE events SET totalETHBal = 0 WHERE id = ${eventPayload.id};`
            );
            await wallet.ether_transfer(
              getAddress(eventPayload.DAPP_ADDRESS.toLowerCase()),
              getAddress(msg_sender),
              parseEther((event?.totalETHBal).toString())
            );
            processed = true;
          } else throw new Error("Event is either pending or cancelled");
        } else throw new Error("Access Denied");
      }

      //Cancel Event
      if (eventPayload.action === "cancel_event") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        if (event?.organizer === data.metadata.msg_sender.toLowerCase()) {
          if (event?.status === EventStatus.Pending) {
            db.run(
              `UPDATE events SET status = ${EventStatus?.Cancelled} WHERE id = ${eventPayload.id};`
            );
            processed = true;
          } else throw new Error("Event is either ended or ongoing");
        } else throw new Error("Access Denied");
      }

      //Withdraw ticket cost if event gets cancelled
      if (eventPayload.action === "withdraw_cancelled_ticket") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.event_id}`
        );

        const event_participants = await db.all(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.event_id};`
        );
        const ticket_price = JSON.parse(event?.tickets).find(
          (event_ticket: any) =>
            Number(event_ticket.id) === Number(eventPayload.ticket_type)
        ).price;

        if (
          ticket_price &&
          check_actions.isParticipant(msg_sender, event_participants) &&
          check_actions.isRefunded(msg_sender, event_participants) &&
          event?.status === EventStatus.Cancelled
        ) {
          const data = wallet.ether_transfer(
            getAddress(eventPayload.DAPP_ADDRESS.toLowerCase()),
            getAddress(msg_sender),
            parseEther(ticket_price.toString())
          );
          if (data?.payload) {
            db.run(
              `UPDATE event_tickets SET refunded = true WHERE id = ${eventPayload.ticket_id};`
            );
          }
          processed = true;
        } else throw new Error("Access Denied, Not Participant");
      }

      //create a proposal for an event you are participating
      if (eventPayload.action === "create_proposal") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        const event_participants = await db.all(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id};`
        );
        if (
          event?.organizer !== data.metadata.msg_sender.toLowerCase() &&
          check_actions.isParticipant(msg_sender, event_participants)
        ) {
          proposal_id++;
          db.run(
            "INSERT INTO event_proposals VALUES (:id, :event_id, :proposer, :proposal, :voters, :upvotes, :downvotes)",
            {
              ":id": proposal_id,
              ":event_id": eventPayload.id,
              ":proposer": msg_sender,
              ":proposal": eventPayload.proposal,
              ":voters": JSON.stringify([]),
              ":upvotes": 0,
              ":downvotes": 0,
            }
          );
          processed = true;
        } else throw new Error("Access Denied");
      }

      //vote or downvote on a proposal
      if (eventPayload.action === "action_proposal") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        const event_proposal: any = await db.get(
          `SELECT * FROM event_proposals WHERE id = ${eventPayload.proposal_id} LIMIT 1;`
        );
        const event_participants = await db.all(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id};`
        );

        let updated_voters = JSON.parse(event_proposal?.voters ?? "[]") ?? [];
        if (
          updated_voters?.length > 0 &&
          updated_voters.find((voter: any) => voter === msg_sender)
        ) {
          throw new Error("Access Denied");
        }

        if (
          event?.organizer !== data.metadata.msg_sender.toLowerCase() &&
          check_actions.isParticipant(msg_sender, event_participants)
        ) {
          if (eventPayload?.upvote) {
            updated_voters.push(msg_sender);
            let increase_votes = event_proposal.upvotes + 1;
            let voters_format = JSON.stringify(updated_voters);

            db.run(
              `UPDATE event_proposals SET upvotes = ?, voters = ? WHERE id = ?`,
              [increase_votes, voters_format, eventPayload.proposal_id]
            );
          } else {
            updated_voters.push(msg_sender);
            let increase_votes = event_proposal.downvotes + 1;
            let voters_format = JSON.stringify(updated_voters);
            db.run(
              `UPDATE event_proposals SET downvotes = ?, voters = ? WHERE id = ?`,
              [increase_votes, voters_format, eventPayload.proposal_id]
            );
          }
          processed = true;
        } else throw new Error("Access Denied");
      }

      //claim poap after event ends
      if (eventPayload.action === "claim_nft") {
        const event: any = await db.get(
          `SELECT * FROM events WHERE id = ${eventPayload.id} LIMIT 1;`
        );
        const event_participants = await db.all(
          `SELECT * FROM event_tickets WHERE event_id = ${eventPayload.id};`
        );
        if (
          event?.organizer !== data.metadata.msg_sender.toLowerCase() &&
          check_actions.isClaimNFT(msg_sender, event_participants)
        ) {
          let voucher: any = router.process("mint_nft", data);
          if (voucher?.destination) {
            await fetch(rollup_server + "/voucher", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(voucher),
            });
            db.run(
              `UPDATE event_tickets SET claimedNFT = true WHERE id = ${eventPayload.ticket_id};`
            );
            return "accept";
          }
        } else throw new Error("Access Denied Or NFT Claimed already");
      }

      //withdraw ether from the dapp
      if (eventPayload.action === "ether_withdraw") {
        let voucher: any = wallet.ether_withdraw(
          getAddress(eventPayload?.args?.DappAddress),
          getAddress(msg_sender),
          BigInt(eventPayload?.args?.amount)
        );

        if (voucher?.destination) {
          await fetch(rollup_server + "/voucher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(voucher),
          });
          return "accept";
        }
      }
    }

    try {
      router.process(eventPayload.action, data);
      processed = true;
    } catch (e) {
      return "reject";
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

  try {
    if (!eventPayload[0]) throw new Error("No action provided");

    //Fetch an event, the event purchased tickets, the event proposals
    if (eventPayload[0] == "get") {
      const event = await db.get(
        `SELECT * FROM events WHERE id = ${eventPayload[1]} LIMIT 1;`
      );
      const event_tickets = await db.all(
        "SELECT * FROM event_tickets WHERE event_id = ?",
        `${eventPayload[1]}`
      );
      const event_referrals = await db.all(
        "SELECT * FROM event_referrals WHERE event_id = ?",
        `${eventPayload[1]}`
      );
      const event_proposals = await db.all(
        "SELECT * FROM event_proposals WHERE event_id = ?",
        `${eventPayload[1]}`
      );

      const payload = toHex(
        JSON.stringify({
          event,
          event_tickets,
          event_referrals,
          event_proposals,
        })
      );
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

    if (eventPayload[0] == "get_user_data") {
      const all_events = await db.all("SELECT * FROM events");

      const user_events = await db.all(
        "SELECT * FROM events WHERE organizer = ?",
        `${eventPayload[1]}`
      );

      const user_event_referrals = await db.all(
        "SELECT * FROM event_referrals WHERE owner = ?",
        `${eventPayload[1]}`
      );

      const user_event_tickets = await db.all(
        "SELECT * FROM event_tickets WHERE address = ?",
        `${eventPayload[1]}`
      );
      const user_event_proposals = await db.all(
        "SELECT * FROM event_proposals WHERE proposal = ?",
        `${eventPayload[1]}`
      );

      const payload = toHex(
        JSON.stringify({
          all_events,
          user_events,
          user_event_referrals,
          user_event_tickets,
          user_event_proposals,
        })
      );
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
