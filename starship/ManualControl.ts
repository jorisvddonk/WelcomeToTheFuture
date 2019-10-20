import { InputType, Field } from "type-graphql";

@InputType({ description: "Manual control input" })
export class ManualControl {
  @Field({ nullable: true })
  thrusting?: boolean;

  @Field({ nullable: true })
  desiredAngle?: number;
}
