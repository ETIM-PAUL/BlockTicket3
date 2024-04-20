import { EventStatus } from "./interface";

class CheckActions {
    constructor(wallet) {
        this.wallet = wallet;
    }

    create_event(event_data, event_types, msg_sender, dapp_address) {
        const balance = this.wallet.balance_get(msg_sender);
        const eth_balance = balance.ether_get();
        const event_price = 0;
        if (!event_data?.dao && !event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[0]?.price)) {
                console.log("User balance not enough to create a basic event");
            } else check = true;
            event_price = BigInt(event_types[0]?.price)
        }
        if (event_data?.dao && !event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[1]?.price)) {
                console.log("User balance not enough to create a dao based event");
            } else check = true;
            event_price = BigInt(event_types[1]?.price)
        }
        if (!event_data?.dao && event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[2]?.price)) {
                console.log("User balance not enough to create a referral based event");
            } else check = true;
            event_price = BigInt(event_types[2]?.price)
        }
        if (!event_data?.dao && event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[3]?.price)) {
                console.log("User balance not enough to create a complete package event");
            } else check = true;
            event_price = BigInt(event_types[3]?.price)
        }
        if (check) {
            this.wallet.ether_transfer(msg_sender, dapp_address, event_price)
            return true;
        } else {
            return false;
        }
    }

    buy_event_ticket(payload, dapp_address, event_tickets, msg_sender, event_referrals, event_data, event_participants) {

        if (event_data.status !== EventStatus.Pending) {
            throw new Error("Event has either ended, cancelled or ongoing");
        }
        if (event_participants === event_data.capacity) {
            throw new Error(`Event participants has reached it's capacity`);
        }

        const balance = this.wallet.balance_get(msg_sender);
        const eth_balance = balance.ether_get();
        let ticket_fee = event_tickets.find((event_ticket) => event_ticket.type.id === payload.type.id).type.amount;
        const user_referral = event_referrals.find((event_referral) => event_referral.owner === msg_sender)


        if (!!ticket_fee) {
            throw new Error(`Invalid Ticket`);
        }
        if (user_referral.count >= event_data.min_referrals) {
            let holding_ticket_fee = ticket_fee;
            ticket_fee = (event_data.referral_discount * holding_ticket_fee) / 100
        }
        if (Number(eth_balance) < Number(ticket_fee)) {
            throw new Error(`User ethers balance not enough to buy ${payload.type.name} ticket`);
        } else check = true;

        if (check) {
            this.wallet.ether_transfer(msg_sender, dapp_address, BigInt(ticket_fee))
            return true;
        } else {
            return false;
        }
    }

    get_referral_code_details(referral_codes) {
        const referral_code_details = referral_codes.find((referral) => referral.code === referral.code);
        if (referral_code_details) {
            return referral_code_details
        }
    }
}

module.exports = { CheckActions };

// { "action": "create_event", "title": "Demo Event", "date": "2024-04-05", "location": "ikorodu", "prices": "", "capacity": 20, "dao": "false", "referral": "false", "minReferrals": 5, "referralDiscount": 2, "tokenUrl": "http", "ether_amount": 2e18}