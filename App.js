import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  CheckBox,
  Switch,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView
} from "react-native";

const defaultList = ["Get up in the morning", "Brush my teeth"];

export default class ToDoApp extends React.Component {
  constructor(props) {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      list: props.list,
      doneList: props.doneList
    };
    this.doneList = [...props.doneList];
    this.list = [...this.state.list];
  }

  componentWillUpdate(nextProps, nextState) {
    this.doneList = [];
    this.list = [...nextState.list];
  }
  render() {
    return (
      <ScrollView style={styles.App}>
        <View id="list" style={styles.widgetUl}>
          <View style={styles.header}>
            <Text style={(styles.textHd, styles.App)} lassName="title">
              My to do list{" "}
            </Text>
          </View>
        </View>
        <View id="list" style={styles.widgetUl}>
          <View className="add_reset_section" style={styles.addResetSection}>
            <TextInput
              style={styles.input}
              ref={ref => (this.newItem = ref)}
              placeholder="Add a new task..."
            />
          </View>
          <View className="button add" style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this._handleAddItem}
              title="Add"
              style={styles.button}
            >
              <Text style={styles.textBt}>Add </Text>
            </TouchableOpacity>
          </View>
          <View className="button reset" style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this._handleResetList}
              title="Reset"
              style={styles.button}
            >
              <Text style={styles.textBt}>Reset </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.list.map((value, i) => {
          return (
            <ToDoList
              key={i}
              item={value}
              removeItem={this._handleUpdateDoneList}
              id={i}
            />
          );
        })}
        <View id="list" style={styles.widgetUl}>
          <TouchableOpacity
            onPress={this._handleRemoveDoneItems}
            title="Remove"
            style={styles.buttonRemove}
          >
            <Text style={styles.textBt}>Remove </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  _handleAddItem = () => {
    let newItem = this.newItem._lastNativeText;
    if (newItem !== "") {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState({ list: [...this.state.list, newItem] });
      this.newItem.clear();
    }
  };

  _handleResetList = () => {
    this.setState({ list: defaultList });
  };

  _handleUpdateDoneList = id => {
    let checkIfInDoneList = this.doneList.filter(function(val) {
      return val === id;
    });
    if (checkIfInDoneList === undefined || checkIfInDoneList.length === 0) {
      // add to list
      this.doneList.push(id);
    } else {
      //delete from list
      this.doneList = this.doneList.filter(function(val) {
        return val !== id;
      });
    }
  };

  _handleRemoveDoneItems = e => {
    this.doneList.sort((a, b) => a - b);
    for (var i = this.doneList.length - 1; i >= 0; i--)
      this.list.splice(this.doneList[i], 1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ list: [...this.list] });
    this.doneList = [];
  };
}
ToDoApp.propTypes = {
  list: PropTypes.array
};

ToDoApp.defaultProps = {
  list: defaultList,
  doneList: []
};

class ToDoList extends React.Component {
  constructor(props) {
    super();
    this.state = { value: props.item, checked: false };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item)
      this.setState({ ...this.state, value: nextProps.item, checked: false });
  }
  _handleCheckBoxClick = e => {
    this.setState({
      checked: !this.state.checked
    });
    this.props.removeItem(this.props.id);
  };

  render() {
    /** RENDER  **/
    let text = this.state.checked ? (
      <Text>{this.state.value}</Text>
    ) : (
      this.state.value
    );
    let checked = this.state.checked ? "checked" : "";
    return (
      <View id="list" style={styles.widgetUl}>
        <View
          className="main"
          style={styles.main}
          style={{ flex: 11, flexBasis: 250, flexDirection: "row" }}
        >
          {Platform.OS === "android" ? (
            <CheckBox
              onValueChange={this._handleCheckBoxClick}
              value={this.state.checked}
            />
          ) : (
            <Switch
              onValueChange={this._handleCheckBoxClick}
              value={this.state.checked}
            />
          )}

          <Text style={styles.textBd}>{text}</Text>
        </View>
      </View>
    );
  }

  componentWillUnmount() {}
}
const styles = StyleSheet.create({
  App: {
    textAlign: "center",
    fontSize: 30,
    paddingTop: 10
  },
  widgetUl: {
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    alignItems: "center"
  },
  header: {
    flexBasis: 250,
    flex: 1,
    padding: 10
  },
  footer: {
    flexBasis: 250,
    flex: 1
  },
  main: {
    flex: 1,
    flexBasis: 250,
    padding: 10
  },
  addResetSection: {
    flex: 3,
    padding: 0
  },
  input: {
    paddingBottom: 15,
    paddingTop: 5,
    fontSize: 20,
    paddingLeft: 5
  },
  textBt: {
    color: "#fff"
  },
  textBd: {
    fontSize: 20
  },
  textHd: {
    fontSize: 30
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 12,
    marginRight: 5,
    flex: 2
  },
  buttonRemove: {
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 12,
    marginRight: 5,
    flexBasis: 150
  }
});
