var menu = {};
menu.agent = [
    {
        name:"New Players",
        method:"getNewPlayer()",
        href:"#newregs",
        class:"nav-link"
    },
    {
        name:"Enaled Players",
        method:"getEnabledPlayer()",
        href:"#enbplayer",
        class:"nav-link"
    },
    {
        name:"Recharge",
        method:"more()",
        href:"#more",
        class:"nav-link"
    },
    {
        name:"Withdrawal",
        method:"reqWithdrawal()",
        href:"#withdrawal",
        class:"nav-link"
    },
    {
        name:"Transactions",
        method:"getMyTransactions()",
        href:"#transhist",
        class:"nav-link"
    },
    {
        name:"Analytics",
        method:"analytics()",
        href:"#analytics",
        class:"nav-link"
    }
];

menu.admin = [
{}
    ];

module.exports = menu;