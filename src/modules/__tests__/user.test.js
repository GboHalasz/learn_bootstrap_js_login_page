import { userData } from '../user';

describe("userData", () => {
    let storageMock;

    beforeEach(() => {
        storageMock = {
            getItem: jest.fn()
        };
    });

    test("should set user.name to empty string if storage has no user", () => {
        storageMock.getItem.mockReturnValue(null);
        const { user } = userData(storageMock);
        expect(user.name).toBe("");
    });

    test("should set user.name from storage if user data exists", () => {
        storageMock.getItem.mockReturnValue(JSON.stringify({ name: "Alice" }));
        const { user } = userData(storageMock);
        expect(user.name).toBe("Alice");
    });

    test("should update user.name on storeData event", () => {

        let callCount = 0;
        storageMock.getItem.mockImplementation(() => {
            callCount++;
            return callCount <= 2
                ? JSON.stringify({ name: "Alice" })
                : JSON.stringify({ name: "Bob" });
        });

        const { user } = userData(storageMock);
        expect(user.name).toBe("Alice");

        // storeData esemény kiváltása
        window.dispatchEvent(new Event("storeData"));

        expect(user.name).toBe("Bob");
    });
});