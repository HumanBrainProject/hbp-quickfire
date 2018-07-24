import React from "react";
import { Panel, Glyphicon } from "react-bootstrap";
import injectStyles from "react-jss";
import { isFunction, uniqueId } from "lodash";

const styles = {
  actionButtonContainer: {
    float: "right"
  },
  actionButton: {
    paddingLeft: "5px"
  }
};

@injectStyles(styles)
export default class GenericListItem extends React.Component {
  static defaultProps = {
    itemTitle: ({ item }) => item,
    actions: [],
    items: [],
    expanded: false
  };

  state = {
    expanded: this.props.expanded
  };

  handleToggle(expanded) {
    if(isFunction(this.props.onBeforeToggle)){
      this.props.onBeforeToggle(() => {this.setState({ expanded: expanded });}, expanded, this.props.item);
    } else {
      this.setState({ expanded: expanded });
    }

    if(isFunction(this.props.onToggle)){
      this.props.onToggle(expanded, this.props.item);
    }
  }

  render() {
    const {
      classes,
      actions,
      item,
      itemTitle: ItemTitle,
      itemBody: ItemBody
    } = this.props;
    const expanded = this.state.expanded;
    const expandedIcon = expanded ? "chevron-up" : "chevron-down";
    return (
      <Panel
        expanded={expanded}
        onToggle={this.handleToggle.bind(this)}
        className={"quickfire-generic-list-item"}
      >
        <Panel.Heading>
          <div className={classes.actionButtonContainer}>
            {actions.map(action =>
              React.cloneElement(action, {
                key: uniqueId("action_"),
                onClick: () => action.props.onClick(item),
                className: [action.props.className, classes.actionButton]
              })
            )}
            {ItemBody && (
              <Panel.Toggle className={classes.actionButton}>
                <Glyphicon glyph={expandedIcon} />
              </Panel.Toggle>
            )}
          </div>
          <Panel.Title>
            <ItemTitle item={item} />
          </Panel.Title>
        </Panel.Heading>
        {ItemBody && (
          <Panel.Body collapsible>
            <ItemBody item={item} />
          </Panel.Body>
        )}
      </Panel>
    );
  }
}
