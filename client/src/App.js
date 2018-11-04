import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import mapDispatchToProps from "./store/actions";
import "./App.sass";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vasts: [],
      vast: {},
      error: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getVasts = this.getVasts.bind(this);
  }

  async onSubmit(fromData) {

    if (fromData.position === undefined) fromData.position = 'bottom_right'
    if (fromData.hideUI === undefined) fromData.hideUI = false

    await this.props.addVast(fromData).then(resp => {
      if (resp.hasOwnProperty("vastURL")) {
        this.state.vasts.push({
          id: this.state.vasts[this.state.vasts.length - 1].id + 1,
          vast_url: resp.vastURL,
          position: resp.position,
          hide_ui: resp.hideUI
        });
        this.setState({ error: '' });
      } else {
        this.setState({ error: resp });
      }
    });
  }

  async getVasts() {
    await this.props.getVasts();
  }

  async getVast(id) {
    await this.props.getVast(id);
  }

  componentDidMount() {
    this.getVasts().then(() => {
      this.setState({ vasts: this.props.vasts });
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { vasts, error } = this.state;

    return (
      <div className="app">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                  <label>Url</label>
                  <Field
                    name="vastURL"
                    type="text"
                    id="vastURL"
                    label="Vast URL"
                    placeholder="Type vastURL"
                    component="input"
                  />
                </fieldset>
                <fieldset>
                  <label>Positions</label>
                  <Field name="position" component="select">
                    <option value="bottom_right">Bottom Right</option>
                    <option value="top_left">Top Left</option>
                    <option value="top_middle">Top Middle</option>
                    <option value="top_right">Top Right</option>
                    <option value="middle_left">Middle Left</option>
                    <option value="middle_right">Middle Right</option>
                    <option value="bottom_left">Bottom Left</option>
                    <option value="bottom_middle">Bottom Middle</option>
                  </Field>
                </fieldset>
                <fieldset>
                  <label htmlFor="hideUI">Hide UI</label>
                  <Field
                    name="hideUI"
                    id="hideUI"
                    component="input"
                    type="checkbox"
                  />
                </fieldset>

                <button type="submit" className="btn btn-primary">
                  Add
                </button>
                <hr />
                {error ? (
                  <div className="bg-dark p-2 text-danger">{error}</div>
                ) : null}
              </form>
            </div>
            <div className="col-8">
              {
                vasts.length ?
                <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>url</th>
                    <th>position</th>
                    <th>hidden</th>
                    <th>link</th>
                  </tr>
                </thead>
                <tbody>
                  {vasts.map(function(vast, index) {
                    return (
                      <tr key={index}>
                        <td>{vast.id}</td>
                        <td>
                          <a href={vast.vast_url}>{vast.vast_url}</a>
                        </td>
                        <td>{vast.position}</td>
                        <td>{vast.hide_ui}</td>
                        <td>
                          <a
                            href={
                              "http://localhost:3333/fetch_vast?id=" +
                              vast.id
                            }
                            className="btn btn-success"
                          >
                            xml
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  vasts: state.vasts.vasts,
  vast: state.vasts.vast
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({ form: "vasts" })
)(App);
