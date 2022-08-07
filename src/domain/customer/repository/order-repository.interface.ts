import RepositoryInterface from "../../@shared/repository/repository-interface";
import Order from "../../checkout/entity/order";
import Customer from "../entity/customer";

export default interface OrderRepositoryInterface
  extends RepositoryInterface<Order> {}
