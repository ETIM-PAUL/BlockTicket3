// export const checkEthValue = (payload: Event, amount: String | Number) => {
//   if (payload.dao && payload.referral && amount !== Number(parseEther(String(parseInt("0.001")), "gwei"))) {
//     throw new Error("Invalid ethers amount, ")
//   }
// } 


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
                console.log("User deposit not enough to create a basic event");
            } else check = true;
            event_price = BigInt(event_types[0]?.price)
        }
        if (event_data?.dao && !event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[1]?.price)) {
                console.log("User deposit not enough to create a dao based event");
            } else check = true;
            event_price = BigInt(event_types[1]?.price)
        }
        if (!event_data?.dao && event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[2]?.price)) {
                console.log("User deposit not enough to create a referral based event");
            } else check = true;
            event_price = BigInt(event_types[2]?.price)
        }
        if (!event_data?.dao && event_data?.referral) {
            if (Number(eth_balance) < Number(event_types[3]?.price)) {
                console.log("User deposit not enough to create a complete package event");
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

    buy_event_ticket(payload, event_tickets, msg_sender) {
        const balance = this.wallet.balance_get(msg_sender);
        const eth_balance = balance.ether_get();
        const ticket_fee = event_tickets.find((event_ticket) => event_ticket.type.id === payload.type.id).type.amount;

        if (Number(eth_balance) < Number(ticket_fee)) {
            console.log(`User ethers balance not enough to buy the ${payload.type.name} ticket`);
        } else check = true;

        if (check) {
            this.wallet.ether_transfer(msg_sender, dapp_address, BigInt(ticket_fee))
            return true;
        } else {
            return false;
        }
    }
}

module.exports = { CheckActions };

// { "action": "create_event", "title": "Demo Event", "date": "2024-04-05", "location": "ikorodu", "prices": "", "capacity": 20, "dao": "false", "referral": "false", "minReferrals": 5, "referralDiscount": 2, "tokenUrl": "http", "ether_amount": 2e18}