const data = [
    {
        type: 'base',
        layer: 0,
        level:0,
        row: 0,
        column: 0,
        name: 'Label 1',
        isExpandable: true,
        extensions: [{
            type: 'extension',
            layer: 0,
            level: 1,
            row: 0,
            column:0,
            subLayer: 0,
            area: {
                pos1: {
                    x:0,
                    z:0
                },
                pos2: {
                    x:0.5,
                    z:0.5
                }
            },
            isExpandable: true,
            extensions: [{
                type: 'extension',
                layer: 0,
                row: 0,
                column: 0,
                level:2,
                subLayer: 0,
                area: {
                    pos1: {
                        x:0,
                        z:0
                    },
                    pos2: {
                        x:0.5,
                        z:0.5
                    }
                },
                isExpandable: false
            }]
        },
        {
            type: 'extension',
            layer: 0,
            row: 0,
            column: 0,
            level:1,
            subLayer: 1,
            area: {
                pos1: {
                    x:0,
                    z:0.5
                },
                pos2: {
                    x:0.5,
                    z:1
                }
            },
            isExpandable: false
        },
        {
            type: 'extension',
            layer: 0,
            row: 0,
            column: 0,
            level:1,
            subLayer: 2,
            area: {
                pos1: {
                    x:0.5,
                    z:0
                },
                pos2: {
                    x:1,
                    z:0.5
                }
            },
            isExpandable: false
        },
        {
            type: 'extension',
            layer: 0,
            row: 0,
            column: 0,
            level:1,
            subLayer: 3,
            area: {
                pos1: {
                    x:0.5,
                    z:0.5
                },
                pos2: {
                    x:1,
                    z:1
                }
            },
            isExpandable: false
        }]
    },
    // {
    //     layer: 0,
    //     row: 1,
    //     column: 0,
    //     name: 'Label 2'
    // },
    // {
    //     layer: 0,
    //     row: 1,
    //     column: 1,
    //     name: 'Label 3'
    // },
    // {
    //     layer: 0,
    //     row: 0,
    //     column: 1,
    //     name: 'Label 4'
    // },
    {
        type: 'base',
        layer: 1,
        level: 0,
        row: 0,
        column: 0,
        name: 'Label 5',
        isExpandable: true,
        extensions: [{
            type: 'extension',
            layer: 1,
            row: 0,
            column: 0,
            level:1,
            subLayer: 0,
            area: {
                pos1: {
                    x:0,
                    z:0
                },
                pos2: {
                    x:0.5,
                    z:0.5
                }
            },
            isExpandable: false
        }]
    },
    // {
    //     layer: 1,
    //     row: 1,
    //     column: 0,
    //     name: 'Label 6'
    // },
    // {
    //     layer: 1,
    //     row: 1,
    //     column: 1,
    //     name: 'Label 7'
    // },
    // {
    //     layer: 1,
    //     row: 0,
    //     column: 1,
    //     name: 'Label 8'
    // },
    {
        type: 'base',
        layer: 2,
        level:0,
        row: 0,
        column: 0,
        name: 'Label 9',
        isExpandable: false
    },
    // {
    //     layer: 2,
    //     row: 1,
    //     column: 0,
    //     name: 'Label 10'
    // },
    // {
    //     layer: 2,
    //     row: 1,
    //     column: 1,
    //     name: 'Label 11'
    // },
    // {
    //     layer: 2,
    //     row: 0,
    //     column: 1,
    //     name: 'Label 12'
    // }
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