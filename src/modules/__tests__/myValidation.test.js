import {regValidation} from '../myValidation';
import {TextEncoder} from 'util';

global.TextEncoder = TextEncoder;
let myRegFormObject;

beforeEach(() => {
    // Mock DOM elements
    global.window = {};
    ['regUName', 'regEmail', 'regPass1', 'regPass2', 'logEmail', 'logPassword'].forEach(id => {
        window[id] = {
            value: '',
            classList: {
                add: jest.fn(),
                remove: jest.fn()
            },
            addEventListener: jest.fn()
        };
        window[`${id}Warn`] = {classList: {add: jest.fn(), remove: jest.fn()}};
    });

    window.logWarn = {classList: {add: jest.fn(), remove: jest.fn()}};

    global.regBtn = {
        classList: {
            add: jest.fn(),
            remove: jest.fn()
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        removeAttribute: jest.fn(),
        setAttribute: jest.fn(),
    };

    const mockDigest = jest.fn(() => {
        const mockBuffer = new Uint8Array(64).fill(1).buffer;
        return Promise.resolve(mockBuffer);
    });

    const mockSubtle = {digest: mockDigest};

    Object.defineProperty(globalThis, 'crypto', {
        value: {subtle: mockSubtle},
        configurable: true
    });

    myRegFormObject= regValidation();
});

describe('Validation logic', () => {
    test('Username must be at least 3 characters', () => {
        const uname = myRegFormObject.inpFieldsById.regUName;
        expect(uname.isValid('ab')).toBe(false);
        expect(uname.isValid('abc')).toBe(true);
    });

    test('Email regex should validate properly', () => {
        const email = myRegFormObject.inpFieldsById.regEmail;
        expect(email.isValid('notanemail')).toBe(false);
        expect(email.isValid('test@example.com')).toBe(true);
    });

    test('Password confirmation must match', () => {
        window.regPass1.value = 'securepass';
        window.regPass1.type = 'password';
        expect(myRegFormObject.inpFieldsById.regPass2.isValid('securepass')).toBe(true);
        expect(myRegFormObject.inpFieldsById.regPass2.isValid('wrongpass')).toBe(false);
    });
});

describe('Field value handling and hashing', () => {
    test('setValueFromInp hashes password input', async () => {
        const inp = {
            id: 'regPass1',
            value: 'mypassword',
            type: 'password',
            classList: {
                add: jest.fn(), remove: jest.fn()},
            removeAttribute: jest.fn(),
            setAttribute: jest.fn(),
            focus: jest.fn()
        };
        await myRegFormObject.setValueFromInp(inp);
        const val = myRegFormObject.inpFieldsById.regPass1.value;
        expect(typeof val).toBe('string');
        expect(val).not.toBe('mypassword');
        expect(val.length).toBe(128); // SHA-512 hex length
    });

    test('setValueFromInp stores plaintext for non-password', async () => {
        const inp = {
            id: 'regUName',
            value: 'JohnDoe',
            type: 'text',
            classList: {add: jest.fn(), remove: jest.fn()},
            removeAttribute: jest.fn(),
            setAttribute: jest.fn(),
            focus: jest.fn()
        };
        await myRegFormObject.setValueFromInp(inp);
        expect(myRegFormObject.inpFieldsById.regUName.value).toBe('JohnDoe');
    });
});

describe('Form data and state', () => {
    test('dataToJson includes only fields with storageName', () => {
        const data = myRegFormObject;
        data.inpFieldsById.regUName.value = 'Alice';
        data.inpFieldsById.regEmail.value = 'alice@example.com';
        data.inpFieldsById.regPass1.value = 'hashedpass';

        const result = JSON.parse(data.dataToJson());
        expect(result).toHaveProperty('name', 'Alice');
        expect(result).toHaveProperty('email', 'alice@example.com');
        expect(result).toHaveProperty('password', 'hashedpass');
        expect(Object.keys(result)).not.toContain('regPass2');
    });

    test('resetValues sets all values to empty strings', () => {
        const data = myRegFormObject;
        data.inpFieldsById.regUName.value = 'filled';
        data.resetValues();
        expect(data.inpFieldsById.regUName.value).toBe('');
    });

    test('resetFields clears DOM field values', () => {
        window.regUName.value = 'some input';
        myRegFormObject.resetFields();
        expect(window.regUName.value).toBe('');
    });

    test('regValuesAreReady returns false if any reg field is missing', () => {
        myRegFormObject.inpFieldsById.regUName.value = 'John';
        myRegFormObject.inpFieldsById.regEmail.value = '';
        expect(myRegFormObject.regValuesAreReady()).toBe(false);
    });

    test('regValuesAreReady returns true if all reg fields have values', () => {
        const data = myRegFormObject;
        data.inpFieldsById.regUName.value = 'User';
        data.inpFieldsById.regEmail.value = 'test@example.com';
        data.inpFieldsById.regPass1.value = 'pass1';
        data.inpFieldsById.regPass2.value = 'pass1';
        expect(data.regValuesAreReady()).toBe(true);
    });
});

describe('Error handling in checkField()', () => {
    test('Empty input triggers warning and returns empty string', () => {
        const inp = {
            id: 'regUName',
            value: '',
            classList: {add: jest.fn(), remove: jest.fn()},
            dataset: {
                error: 'invalid',
            },
            removeAttribute: jest.fn(),
            setAttribute: jest.fn(),
            focus: jest.fn()
        };
        const result = myRegFormObject.checkField(inp);
        expect(result).toBe('');
        expect(inp.classList.add).toHaveBeenCalledWith('is-invalid');
    });

    test('Invalid input triggers warning', () => {
        const inp = {
            id: 'regUName',
            value: 'ab',
            classList: {add: jest.fn(), remove: jest.fn()},
            dataset: {
                error: 'invalid',
            },
            removeAttribute: jest.fn(),
            setAttribute: jest.fn(),
            focus: jest.fn()
        };
        const result = myRegFormObject.checkField(inp);
        expect(inp.classList.add).toHaveBeenCalledWith('is-invalid');
        expect(result).toBe('');
    });
});
describe('Adding listeners', () => {
    test('startValidation set registerBtnCallback and adds event listener to each input', () => {
        const mockCallback = jest.fn();
        const form = regValidation();
        form.startValidation('focusout', mockCallback);

        expect(form.registerBtnCallback).toEqual(mockCallback);
        for (const field in form.inpFieldsById) {
            expect(window[field].addEventListener).toHaveBeenCalledWith('focusout', expect.any(Function));
        }
    });
    test('addListenerToRegBtn registers click and triggers expected actions when validation passes', () => {

        myRegFormObject.registerBtnCallback = jest.fn();
        myRegFormObject.resetFields = jest.fn();
        myRegFormObject.resetValues = jest.fn();
        myRegFormObject.disableRegBtn = jest.fn();
        myRegFormObject.regValuesAreReady = jest.fn().mockReturnValue(true);

        myRegFormObject.addListenerToRegBtn();


        const clickHandler = regBtn.addEventListener.mock.calls.find(call => call[0] === 'click')[1];
        clickHandler();

        expect(myRegFormObject.registerBtnCallback).toHaveBeenCalled();
        expect(myRegFormObject.resetFields).toHaveBeenCalled();
        expect(myRegFormObject.resetValues).toHaveBeenCalled();
        expect(myRegFormObject.disableRegBtn).toHaveBeenCalled();
    });
    test('addListenerToRegBtn throws error when validation fails', () => {

        myRegFormObject.regValuesAreReady = jest.fn().mockReturnValue(false);

        myRegFormObject.addListenerToRegBtn();

        const clickHandler = regBtn.addEventListener.mock.calls.find(call => call[0] === 'click')[1];

        expect(() => clickHandler()).toThrow("Input validation logic broken!");
    });
});
describe('Remove listeners', () => {
    test('removeListenerToRegBtn correctly removes click handler', () => {
        myRegFormObject.handleRegBtnClick = jest.fn();

        const clickHandlers = {};

        regBtn.addEventListener.mockImplementation((event, cb) => {
            clickHandlers[event] = cb;
        });

        regBtn.removeEventListener.mockImplementation((event, cb) => {
            // remove if the callback is the same
            if (clickHandlers[event] === cb) {
                delete clickHandlers[event];
            }
        });

        myRegFormObject.addListenerToRegBtn();

        myRegFormObject.removeListenerToRegBtn();

        if (clickHandlers['click']) {
            clickHandlers['click']();
        }

        expect(myRegFormObject.handleRegBtnClick).not.toHaveBeenCalled();
    });
});
describe('Registration button state control', () => {
    test('enableRegBtn removes "disabled" class from regBtn', () => {
        const form = regValidation();
        form.enableRegBtn();
        expect(regBtn.classList.remove).toHaveBeenCalledWith("disabled");
    });

    test('disableRegBtn adds "disabled" class to regBtn', () => {
        const form = regValidation();
        form.disableRegBtn();
        expect(regBtn.classList.add).toHaveBeenCalledWith("disabled");
    });
});