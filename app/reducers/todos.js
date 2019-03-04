const initialState = [
    {
        text: 'Main mode',
    }
];

export default function todos(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_MODE':
          return [
            ...state,
            {
              text: action.text
            }
          ];
        }
}