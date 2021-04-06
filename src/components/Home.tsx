/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from "react";

interface IProps {}

export default class Home extends Component<IProps> {
  props!: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          delectus sequi dolorem illo laudantium voluptate nemo perspiciatis
          nihil provident, sint temporibus corrupti excepturi, voluptatibus
          repellendus nulla. Quia inventore asperiores amet.
        </p>
      </div>
    );
  }
}
