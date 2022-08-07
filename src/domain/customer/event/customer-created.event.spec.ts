import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import ConsoleLog1WhenCustomerIsCreatedHandler from "./handler/console-log-1-when-customer-is-created.handler";
import ConsoleLog2WhenCustomerIsCreatedHandler from "./handler/console-log-2-when-customer-is-created.handler";

describe("Customer created events tests", () => {
  it("should notify when Customer was created", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new ConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new ConsoleLog2WhenCustomerIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer",
      address: "Address",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
