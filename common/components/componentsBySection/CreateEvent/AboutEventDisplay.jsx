// @flow

import React from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import CurrentUser from "../../utils/CurrentUser.js";
import {EventData} from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section";


type Props = {|
  event: ?EventData,
  viewOnly: boolean
|};

type State = {|
  event: ?EventData
|};

class AboutEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void{
    super();
    this.state = {
      event: props.event
    };
 }

  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.event !== this.props.event) {
      this.setState({
        event: nextProps.event
      });
    }
  }

  render(): ?$React$Node {
    const event:EventData = this.state.event;
    return !event ? null : (
      <div className="AboutEvent-root container">

        <div className="AboutEvent-title row">
          <div className="col-12">
            <div className="AboutEvent-title-date">
              {moment(event.event_date_start).format("MMMM Do YYYY")}
            </div>
            <h1>{event.event_name}</h1>
          </div>
        </div>

        <div className="AboutEvent-EventBanner row">
          <div className="AboutEvent-info col-xs-12 col-lg-4">
            <h4>Info</h4>
            {/*TODO: Handle multi-day events*/}
            <h5 className="AboutEvent-info-header">Date</h5>
            <p>{moment(event.event_date_start).format("dddd, MMMM Do YYYY")}</p>

            <h5 className="AboutEvent-info-header">Time</h5>
            <p>{this._renderTimeRange()}</p>

            <h5 className="AboutEvent-info-header">Location</h5>
            <p>{this.state.event.event_location}</p>

            {this.state.event.event_rsvp_url && this._renderRSVPButton()}
            {!this.props.viewOnly && this._renderJoinLiveEventButton()}
          </div>
          <div className="col-xs-12 col-lg-8 AboutEvent-splash">
              <img src={event.event_thumbnail.publicUrl} />
          </div>
        </div>

        <div className="AboutEvent-details col-12">
          <h3>Details</h3>
          <p>{event.event_short_description}</p>
          <p>{event.event_description}</p>
          <h3>What We Will Do</h3>
          <p>{event.event_agenda}</p>
        </div>
          {/*TODO: Show projects*/}
      </div>
    )
  }

  _renderTimeRange(): string {
    const timeFormat: string = "h:mm a";
    const timeZone: string = "PST";
    return moment(this.state.event.event_date_start).format(timeFormat) + " - " +
      moment(this.state.event.event_date_end).format(timeFormat) + " " + timeZone;
  }

  _renderRSVPButton(): ?$React$Node {
    return (
      <Button
        variant="primary"
        className="AboutEvent-rsvp-btn"
        type="button"
        href={this.state.event.event_rsvp_url}
      >
        RSVP on Eventbrite
      </Button>
    );
  }

  _renderJoinLiveEventButton(): ?$React$Node {
    let text: string = "";
    let url: string = "";
    if(CurrentUser.isLoggedIn()) {
      //TODO: Handle un-verified users
      text = "Join Event";
      url = urlHelper.section(Section.LiveEvent);
    } else {
      text = "Log In to Join Event";
      url = urlHelper.logInThenReturn();
    }

    return (
      <Button
        variant="primary"
        size="lg"
        className="AboutEvent-join-btn"
        type="button"
        title={text}
        href={url}
      >
        {text}
      </Button>
    );
  }

}

export default AboutEventDisplay;
