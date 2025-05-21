import { storeData } from '../storeData';

describe('storeData', () => {
    let mockStorage;
    let dispatchSpy;

    beforeEach(() => {
        mockStorage = {
            setItem: jest.fn(),
            removeItem: jest.fn(),
        };

        dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should store data in storage and dispatch "storeData" event', () => {
        const { storeInStorage } = storeData(mockStorage);
        const key = 'testKey';
        const value = '{"foo":"bar"}';

        storeInStorage(key, value);

        expect(mockStorage.setItem).toHaveBeenCalledWith(key, value);
        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(dispatchSpy.mock.calls[0][0].type).toBe('storeData');
    });

    it('should remove data from storage and dispatch "storeData" event', () => {
        const { removeFromStorage } = storeData(mockStorage);
        const key = 'testKey';

        removeFromStorage(key);

        expect(mockStorage.removeItem).toHaveBeenCalledWith(key);
        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(dispatchSpy.mock.calls[0][0].type).toBe('storeData');
    });
});