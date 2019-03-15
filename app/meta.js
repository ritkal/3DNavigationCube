const data = [
    {
        layer: 0,
        row: 0,
        column: 0,
        name: 'Label 1'
    },
    {
        layer: 0,
        row: 1,
        column: 0,
        name: 'Label 2'
    },
    {
        layer: 0,
        row: 1,
        column: 1,
        name: 'Label 3'
    },
    {
        layer: 0,
        row: 0,
        column: 1,
        name: 'Label 4'
    },
    {
        layer: 1,
        row: 0,
        column: 0,
        name: 'Label 5'
    },
    {
        layer: 1,
        row: 1,
        column: 0,
        name: 'Label 6'
    },
    {
        layer: 1,
        row: 1,
        column: 1,
        name: 'Label 7'
    },
    {
        layer: 1,
        row: 0,
        column: 1,
        name: 'Label 8'
    },
    {
        layer: 2,
        row: 0,
        column: 0,
        name: 'Label 9'
    },
    {
        layer: 2,
        row: 1,
        column: 0,
        name: 'Label 10'
    },
    {
        layer: 2,
        row: 1,
        column: 1,
        name: 'Label 11'
    },
    {
        layer: 2,
        row: 0,
        column: 1,
        name: 'Label 12'
    }
];

const modes = {
    globalObserver: 'Global',
    groupObserver: 'Group',
    infoObserver: 'Info'
};

const animateOn = {
    click: 'elClick',
    dblClick: 'elDblClick'
};

export default {
    data,
    modes,
    animateOn
};