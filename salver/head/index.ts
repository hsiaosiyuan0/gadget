import React from "react";
import { setTitle } from "../config";

export class Head extends React.Component {

  mounted: boolean;

  constructor(props: any) {
    super(props);

    setTitle(this._title(this.props));

    this.mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    this._updateTitle(nextProps);
  }

  _title(props: any) {
    if (props.children) {
      let title = ""
      React.Children.forEach(props.children, (child) => {
        const isTitle = (child as any).type === "title";
        // since user would misunderstand the `Head` therefor add more stuff then `title`
        // we give some advice for user could quickly locate this problem
        if (!isTitle) {
          if (process.env.DEBUG) {
            console.error("consider only use `title` as the child of `Head`");
          }
          return;
        }
        const h = child as JSX.Element;
        title= h.props.children;
      });
      return title;
    }
    return "";
  }

  _updateTitle(props: any) {
    let head = document.getElementsByTagName("head")[0];
    if (!head) {
      head = document.createElement("head");
      document.insertBefore(head, document.body);
    }
    document.title = this._title(props);
  }

  componentDidMount() {
    this.mounted = true;
    this._updateTitle(this.props);
  }

  render() {
    return null;
  }
}
