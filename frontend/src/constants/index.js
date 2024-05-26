import {
    event1,
    event2,
    event3,
    event4,
    event5,
    event6,
} from "../assets";


export const ProposalData = [
    {
        id: "1",
        proposal: "AC Room",
        upvote: "5",
        downvote: "1",
    },

    {
        id: "2",
        proposal: "Charging Port",
        upvote: "10",
        downvote: "2",
    },
    {
        id: "3",
        proposal: "Chilled Drink",
        upvote: "50",
        downvote: "4",
    },

    {
        id: "4",
        proposal: "PopCorn",
        upvote: "20",
        downvote: "2",
    },

    {
        id: "5",
        proposal: "Smoking",
        upvote: "1",
        downvote: "50",
    },

    {
        id: "6",
        proposal: "Ice Creams",
        upvote: "100",
        downvote: "5",
    },
];


export const PastEventsData = [
    {
        id: "1",
        flyer: event1,
        title: "Wonder Girls 2010 Wonder Girls World Tour San Francisco",
        description:
            "We’ll get you directly seated and inside for you to enjoy the show.",
        date: "14th May",
        price: "0.002ETH",
        location: "Kenya",
    },
    {
        id: "2",
        flyer: event2,
        title: "JYJ 2011 JYJ Worldwide Concert Barcelona",
        description: "Directly seated and inside for you to enjoy the show.",
        date: "20th June",
        price: "0.001ETH",
        location: "Nigeria",
    },

    {
        id: "3",
        flyer: event3,
        title: "2011 Super Junior SM Town Live '10 World Tour New York City",
        description: "Directly seated and inside for you to enjoy the show.",
        date: "18th Sept",
        price: "0.2ETH",
        location: "Ghana",
    },

    {
        id: "4",
        flyer: event4,
        title: " Wonder Girls 2010 Wonder Girls World Tour San Francisco",
        description: "Directly seated and inside for you to enjoy the show.",
        date: "20th June",
        price: "0.02ETH",
        location: "New York",
    },

    {
        id: "5",
        flyer: event5,
        title: "2011 Super Junior SM Town Live '10 World Tour New York City",
        description: "Directly seated and inside for you to enjoy the show.",
        date: "25th May",
        price: "0.03ETH",
        location: "London",
    },

    {
        id: "6",
        flyer: event6,
        title: "JYJ 2011 JYJ Worldwide Concert Barcelona",
        description: "Directly seated and inside for you to enjoy the show.",
        date: " 18th July",
        price: "0.002ETH",
        location: "India",
    },

    {
        id: "7",
        flyer: event1,
        title: "Wonder Girls 2010 Wonder Girls World Tour San Francisco",
        description:
            "We’ll get you directly seated and inside for you to enjoy the show.",
        date: "14th May",
        price: "0.015ETH",
        location: "Dubai",
    },
    {
        id: "7",
        flyer: event2,
        title: "JYJ 2011 JYJ Worldwide Concert Barcelona",
        description: "Directly seated and inside for you to enjoy the show.",
        date: "20th June",
        price: "0.001ETH",
        location: "Canada",
    },
];

export const DappAddress = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e";
export const ERC721Address = "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9";

export function formatDate(inputDate) {
    const date = new Date(inputDate);

    // Define the months array
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the day, month, and year
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Define the suffix for the day
    let daySuffix;
    switch (day) {
        case 1:
        case 21:
        case 31:
            daySuffix = 'st';
            break;
        case 2:
        case 22:
            daySuffix = 'nd';
            break;
        case 3:
        case 23:
            daySuffix = 'rd';
            break;
        default:
            daySuffix = 'th';
    }

    // Construct the formatted date string
    const formattedDate = `${day}${daySuffix} ${months[monthIndex]}, ${year}`;

    return formattedDate;
}

export function formatIPFS(ipfsURL) {
    // Regular expression pattern to match the CID in an IPFS URL
    const pattern = /ipfs:\/\/(.*?)(\/|$)/;

    // Extract the CID using the pattern
    const match = ipfsURL.match(pattern);

    // If a match is found, return the CID, else return null
    return match ? match[1] : null;
}