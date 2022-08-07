import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerUpdatedEvent from "./customer-updated.event";
import ConsoleLogWhenCustomerIsUpdatedHandler from "./handler/console-log-when-customer-is-updated.handler";

describe("Customer updated events tests", () => {
  it("should notify when Customer was updated", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerIsUpdatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerUpdatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerUpdatedEvent = new CustomerUpdatedEvent({
      id: "1",
      name: "Customer",
      address: "Address",
    });

    eventDispatcher.notify(customerUpdatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
