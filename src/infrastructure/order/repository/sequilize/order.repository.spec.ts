import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const { orderModel, order, ordemItem } = await CreateNewOrder();

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a new order", async () => {
    const orderRepository = new OrderRepository();

    const order1 = await CreateNewOrder();
    const order2 = await CreateNewOrder(order1.order.id, "456", "456", false);

    await orderRepository.update(order2.order);

    const orderModel = await OrderModel.findOne({
      where: { id: order1.order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order1.order.id,
      customer_id: order2.order.customerId,
      total: order2.order.total(),
      items: [
        {
          id: order2.ordemItem.id,
          name: order2.ordemItem.name,
          price: order2.ordemItem.price,
          quantity: order2.ordemItem.quantity,
          order_id: order2.order.id,
          product_id: order2.order.items[0].productId,
        },
      ],
    });
  });

  it("should find a order", async () => {
    const orderRepository = new OrderRepository();

    const { order } = await CreateNewOrder();

    const orderModelFound = await orderRepository.find(order.id);

    expect(orderModelFound).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();

    const order1 = await CreateNewOrder();
    const order2 = await CreateNewOrder("456", "456", "456");

    const orders = await orderRepository.findAll();

    expect(orders[0]).toStrictEqual(order1.order);
    expect(orders[1]).toStrictEqual(order2.order);
  });

  async function CreateNewOrder(
    orderId: string = "123",
    customerId: string = "123",
    productId: string = "123",
    saveOrder: boolean = true
  ) {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(customerId, "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(productId, "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      orderId,
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order(orderId, customerId, [ordemItem]);

    if (saveOrder) {
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
    }

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    return { orderModel, order, ordemItem };
  }
});
