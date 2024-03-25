import { brakeLogo, bungeLogo, marsLogo, dvicon, dvlogo, facebook, instagram, twitter, linkedin, nestleLogo } from "../assets";

export function hexToString(hex) {
  // Remove the '0x' prefix
  const strippedHexString = hex.slice(2);

  // Convert the hex string to a buffer
  const buffer = Buffer.from(strippedHexString, 'hex');

  // Convert the buffer to a string
  const resultString = buffer.toString('utf-8');
  return resultString;
}

export const allCompanyData = [
  {
    id: "1",
    companyLogo: brakeLogo,
    companyName: "WallStreet Liquid Capitals",
    regNum: "RC2013452",
    pricePerShare: "$100",
    minShare: "10",
    country: "Ghana",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "2",
    companyLogo: nestleLogo,
    companyName: "Nestle Liquid",
    regNum: "RC2013453",
    pricePerShare: "$100",
    minShare: "10",
    country: "Nigeria",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Nigeria with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "3",
    companyLogo: brakeLogo,
    companyName: "Brace Finance",
    regNum: "RC2013454",
    pricePerShare: "$100",
    minShare: "10",
    country: "Kenya",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "4",
    companyLogo: bungeLogo,
    companyName: "OakWood Estates",
    regNum: "RC2013455",
    pricePerShare: "$100",
    minShare: "10",
    country: "Rwanda",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "5",
    companyLogo: brakeLogo,
    companyName: "WallStreet Liquid Capitals",
    regNum: "RC2013456",
    pricePerShare: "$100",
    minShare: "10",
    country: "Ghana",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "6",
    companyLogo: nestleLogo,
    companyName: "Nestle Liquid",
    regNum: "RC2013457",
    pricePerShare: "$100",
    minShare: "10",
    country: "Nigeria",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "7",
    companyLogo: brakeLogo,
    companyName: "Brace Finance",
    regNum: "RC2013458",
    pricePerShare: "$100",
    minShare: "10",
    country: "Kenya",
    status: false,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  },

  {
    id: "8",
    companyLogo: bungeLogo,
    companyName: "OakWood Estates",
    regNum: "RC2013459",
    pricePerShare: "$100",
    minShare: "10",
    country: "Rwanda",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  }, {
    id: "9",
    companyLogo: brakeLogo,
    companyName: "WallStreet Liquid Capitals",
    regNum: "RC2013452",
    pricePerShare: "$100",
    minShare: "10",
    country: "Ghana",
    status: false,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  }, {
    id: "10",
    companyLogo: brakeLogo,
    companyName: "WallStreet Liquid Capitals",
    regNum: "RC2013452",
    pricePerShare: "$100",
    minShare: "10",
    country: "Ghana",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  }, {
    id: "11",
    companyLogo: brakeLogo,
    companyName: "WallStreet Liquid Capitals",
    regNum: "RC2013452",
    pricePerShare: "$100",
    minShare: "10",
    country: "Ghana",
    status: true,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  }, {
    id: "12",
    companyLogo: brakeLogo,
    companyName: "WallStreet Liquid Capitals",
    regNum: "RC2013452",
    pricePerShare: "$100",
    minShare: "10",
    country: "Ghana",
    status: false,
    description:
      "WallStreet Liquid Capitals is a company registered in Ghana with branches across Africa. At WallStreet Liquid Capitals we are into digital assets evaluation, Management, Trading, Consultancy, and giving of grants and equity to small and medium business across Africa to grow. At the Heart of what we do at WallStreet Liquid Capitals is Financial inclusion and easy access of Capitals to the Small and medium business, thereby 'Banking the Unbanked'. Our Current Market Capitalization is 2 Billion ",
  }
];

export const shareHoldersStats = [
  {
    id: "1",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    numberOfShares: "50",
  },

  {
    id: "2",
    address: "0xC76F962e24F4345301296Bf111529047ec3cA96E",
    numberOfShares: "100",
  },

  {
    id: "3",
    address: "0x4acDcdfde59CacB8C16AfF29f91CE61126F7A23C",
    numberOfShares: "70",
  },

  {
    id: "4",
    address: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
    numberOfShares: "110",
  },

  {
    id: "5",
    address: "0x9eb97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
    numberOfShares: "40",
  },

  {
    id: "6",
    address: "0x6eb97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
    numberOfShares: "120",
  },

  {
    id: "7",
    address: "0x7eb97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
    numberOfShares: "150",
  },

  {
    id: "8",
    address: "0x2fb97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
    numberOfShares: "100",
  },
];

export const myCompanyData = [
  {
    id: "1",
    companyLogo: brakeLogo,
    companyName: "WallStreet Capitals",
    regNum: "RC2013452",
    country: "Ghana", status: true,
    totalShares: "$200",
  },

  {
    id: "2",

    companyLogo: bungeLogo,
    companyName: "Brace Finance",
    regNum: "RC2013454",
    country: "Nigeria",
    totalShares: "$100",
  },

  {
    id: "3",

    companyLogo: nestleLogo,
    companyName: "Nestle Liquid",
    regNum: "RC2013457",
    country: "Nigeria",
    totalShares: "$400",
  },

  {
    id: "4",
    companyLogo: brakeLogo,
    companyName: "Brace Finance",
    regNum: "RC2013454",
    country: "Nigeria",
    totalShares: "$400",
  },

  {
    id: "5",

    companyLogo: nestleLogo,
    companyName: "Nestle Liquid",
    regNum: "RC2013457",
    country: "Nigeria",
    totalShares: "$800",
  },

  {
    id: "6",
    companyLogo: bungeLogo,
    companyName: "Brace Finance",
    regNum: "RC2013454",
    country: "Nigeria",
    totalShares: "$100",
  },
];
export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Admin",
        link: "./admin",
      },
      {
        name: "Top gainers",
        link: "#defivista",
      },
      {
        name: "How it Works",
        link: "#defivista",
      },
      {
        name: "Explore",
        link: "#defivista",
      },
      {
        name: "Terms & Services",
        link: "#defivista",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "#defivista",
      },
      {
        name: "Partners",
        link: "#defivista",
      },
      {
        name: "Suggestions",
        link: "#defivista",
      },
      {
        name: "Blog",
        link: "#defivista",
      },
      {
        name: "Newsletters",
        link: "#defivista",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "#defivista",
      },
      {
        name: "Become a Partner",
        link: "#defivista",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/in/",
  },
];