/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from "react";

interface IProps {}

export default class Story extends Component<IProps> {
  props!: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Story!</p>
      </div>
    );
  }
}
