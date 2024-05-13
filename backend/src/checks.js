const { Router } = require("cartesi-router");
const { fromHex, getAddress, parseEther } = require("viem");
const { Wallet } = require("cartesi-wallet");

const wallet = new Wallet(new Map());
const router = new Router(wallet);
class CheckActions {
    constructor(wallet, db) {
        this.wallet = wallet;
        this.db = db;
    }

    create_event(event_data, event_types, msg_sender, dapp_address) {
        const balance = router.process("balance", msg_sender);
        const bal = JSON.parse(fromHex(balance.payload, "string"))
        const eth_balance = bal.ether
        let event_price = 0;
        let check;

        if (!event_data?.dao && !event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[0]?.price)) {
                console.log("User balance not enough to create a basic event");
            } else check = true;
            event_price = event_types[0]?.price
        }
        if (event_data?.dao && !event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[1]?.price)) {
                console.log("User balance not enough to create a dao based event");
            } else check = true;
            event_price = event_types[1]?.price
        }
        if (!event_data?.dao && event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[2]?.price)) {
                console.log("User balance not enough to create a referral based event");
            } else check = true;
            event_price = event_types[2]?.price
        }
        if (event_data?.dao && event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[3]?.price)) {
                console.log("User balance not enough to create a complete package event");
            } else check = true;
            event_price = event_types[3]?.price
        }
        if (check) {
            this.wallet.ether_transfer(getAddress(msg_sender), getAddress(dapp_address), event_price)
            return true;
        } else {
            return false;
        }
    }

    buy_event_ticket(ticket_type_id, dapp_address, event_tickets, msg_sender, event_referrals, event_data, event_participants) {

        if (event_data.status !== 0) {
            throw new Error("Event has either ended, cancelled or ongoing");
        }
        if (event_participants === event_data.capacity) {
            throw new Error(`Event participants has reached it's capacity`);
        }
        const balance = router.process("balance", msg_sender);
        const bal = JSON.parse(fromHex(balance.payload, "string"))
        const eth_balance = bal.ether
        let check;
        let ticket_fee = event_tickets.find((event_ticket) => event_ticket.id === ticket_type_id).price;
        const user_referral = event_referrals.find((event_referral) => event_referral.owner === msg_sender)


        if (!ticket_fee) {
            throw new Error(`Invalid Ticket`);
        }
        if (user_referral?.count >= event_data.minReferrals) {
            let holding_ticket_fee = ticket_fee;
            ticket_fee = (event_data.referralDiscount * holding_ticket_fee) / 100
        }
        if (Number(eth_balance) < Number(ticket_fee)) {
            throw new Error(`User ethers balance not enough to buy ${ticket_type_id.ticketType} ticket`);
        } else check = true;

        if (check) {
            let increase_bal = event_data.totalETHBal + ticket_fee;
            this.db.run(
                `UPDATE events SET totalETHBal = ${increase_count} WHERE id = ${event_data.id};`
            );

            this.wallet.ether_transfer(getAddress(msg_sender), getAddress(dapp_address), parseEther(ticket_fee.toString()))
            return true;
        } else {
            return false;
        }
    }

    isParticipant(msg_sender, participants) {
        const event_participant = participants.find((participant) => participant.address === msg_sender);
        if (event_participant) {
            return true
        } else {
            return false;
        }
    }

    get_referral_code_details(referral_codes, referral_code) {
        const referral_code_details = referral_codes.find((referral) => Number(referral.code) === Number(referral_code));
        if (referral_code_details) {
            return referral_code_details
        } else {
            return null;
        }
    }
}

module.exports = { CheckActions };

// { "action": "create_event", "title": "Demo Event", "date": "2024-04-05", "location": "ikorodu", "tickets": "", "capacity": 20, "organizer":"0x", "dao": false, "referral": false, "minReferrals": 5, "referralDiscount": 2, "tokenUrl": "http", "nftUrl": "hhh"}