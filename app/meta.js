const data = [
    {
        layer: 0,
        row: 0,
        column: 0
    },
    {
        layer: 0,
        row: 1,
        column: 0
    },
    {
        layer: 0,
        row: 1,
        column: 1
    },
    {
        layer: 0,
        row: 0,
        column: 1
    },
    {
        layer: 1,
        row: 0,
        column: 0
    },
    {
        layer: 1,
        row: 1,
        column: 0
    },
    {
        layer: 1,
        row: 1,
        column: 1
    },
    {
        layer: 1,
        row: 0,
        column: 1
    },
    {
        layer: 2,
        row: 0,
        column: 0
    },
    {
        layer: 2,
        row: 1,
        column: 0
    },
    {
        layer: 2,
        row: 1,
        column: 1
    },
    {
        layer: 2,
        row: 0,
        column: 1
    }
];

const modes = {
    mainMode: 'main',
    infoMode: 'Info'
};

const animateOn = {
    click: 'elClick',
    dblClick: 'elDblClic'
};

export default {
    data,
    modes,
    animateOn
};