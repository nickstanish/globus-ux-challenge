import React, { Component } from 'react';
import TestDataButton from './testDataButton';
import DataTable from './dataTable';
import { sortData } from 'utils';

const TEST_DATA = [
  "public/data/test.json",
  "public/data/test2.json",
  "public/data/test3.json",
  "public/data/test4.json"
];

const MESSAGE_TIMEOUT_MS = 5000;

class Message {
  constructor(text, onRemove) {
    this.text = text;
    this.id = window.setTimeout(() => onRemove(this.id), MESSAGE_TIMEOUT_MS);
    this.removeNow = () => {
      const { id } = this;
      window.clearTimeout(id);
      onRemove(id);
    }
  }
}

class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: "",
      loadedSource: {
        dataSource: null,
        data: null
      },
      messages: []
    }
  }

  onChangeDataSource(dataSource) {
    this.setState({
      dataSource
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.loadDataFromSource(this.state.dataSource);
  }

  loadDataFromSource(source) {
    fetch(source)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return {
          ...data,
          DATA: data.DATA.sort(sortData)
        }
      })
      .then( data => {
        this.setState({
          loadedSource: {
            dataSource: source,
            data
          }
        });
      })
      .catch(error => {
        let messageText = 'An error occurred with the selected data';
        if (error instanceof SyntaxError) {
          messageText = 'Unable to parse data due to error in syntax';
        }
        const shallowClonedMessages = this.state.messages.slice(0);
        shallowClonedMessages.push(new Message(messageText, (id) => this.onRemoveMessage(id)));
        this.setState({
          messages: shallowClonedMessages
        });
      })
  }
  onRemoveMessage(id) {
    const filteredMessages = this.state.messages.filter((savedMessage) => {
      return savedMessage.id !== id;
    });
    this.setState({
      messages: filteredMessages
    });
  }
  render() {
    return (
      <div>
        <div className="content-wrapper">
          <h2>Select a test to load</h2>
          <div className="data-input">
            {
              TEST_DATA.map((datum, index) => {
                return (
                  <TestDataButton
                    key={datum}
                    onClick={() => this.loadDataFromSource(datum)}
                    text={`Test ${index+1}`}
                    active={datum === this.state.loadedSource.dataSource}
                  />
                );
              })
            }
          </div>
          <DataTable data={this.state.loadedSource.data} />
        </div>
        <div id="flash">
          {this.state.messages.map(message => {
            return (
              <div key={message.id} className="message">
                <button className="close" onClick={() => message.removeNow()}>x</button>
                {message.text}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Application;
