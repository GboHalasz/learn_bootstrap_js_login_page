import { myWelcome } from '../welcome.js';

describe('myWelcome.show', () => {
    let welcomePlace;

    beforeEach(() => {
        // Create a mock DOM element
        welcomePlace = document.createElement('div');
        welcomePlace.classList.add('d-none');
        document.body.appendChild(welcomePlace);
    });

    afterEach(() => {
        // Clean up the DOM
        document.body.innerHTML = '';
    });

    it('should display welcome message and update classes when userName is provided', () => {
        const welcomeText = 'Hello, ';
        const userName = 'Alice';

        myWelcome.show(welcomeText, welcomePlace, userName);

        expect(welcomePlace.textContent).toBe('Hello, Alice');

        // Check classes
        expect(welcomePlace.classList.contains('d-none')).toBe(false);
        expect(welcomePlace.classList.contains('d-block')).toBe(true);
    });

    it('should replace existing text node if it exists', () => {

        const oldText = document.createTextNode('Old Text');
        welcomePlace.appendChild(oldText);

        const welcomeText = 'Hi, ';
        const userName = 'Bob';

        myWelcome.show(welcomeText, welcomePlace, userName);

        expect(welcomePlace.textContent).toBe('Hi, Bob');
        expect(welcomePlace.childNodes.length).toBe(1); // Only one text node
    });

    it('should do nothing if userName is not provided', () => {
        const welcomeText = 'Hello, ';
        const initialHTML = welcomePlace.innerHTML;

        myWelcome.show(welcomeText, welcomePlace, '');

        expect(welcomePlace.innerHTML).toBe(initialHTML);
    });
});
