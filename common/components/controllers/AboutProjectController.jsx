// @flow

import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {PositionInfo} from "../forms/PositionInfo.jsx";
import ContactProjectButton from "../common/projects/ContactProjectButton.jsx";
import NotificationModal from "../common/notification/NotificationModal.jsx";
import TagsDisplay from '../common/tags/TagsDisplay.jsx'
import url from '../utils/url.js'
import CurrentUser from "../utils/CurrentUser.js";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
import _ from 'lodash'

import React from 'react';
import {Locations} from "../constants/ProjectConstants.js";

type State = {|
  project: ?ProjectDetailsAPIData,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo
|};

class AboutProjectController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();

    this.state = {
      project: null,
      showContactModal: false,
      showPositionModal: false,
      shownPosition: null
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    var projectId = (new RegExp("id=([^&]+)")).exec(document.location.search)[1];
    ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this));
  }

  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState({
      project: project
    });
  }

  handleClose() {
    this.setState({ showContactModal: false });
  }

  render(): React$Node {
    return this.state.project ? this._renderDetails() : <div>Loading...</div>
  }

  _renderDetails(): React$Node {
    const project = this.state.project;
    return (
      <div className="AboutProjectController-root">
        <div className="container-fluid">
          <div style={{backgroundColor: "white"}}>
            <div className="row" style={{margin: "30px 0 0 0", padding: "10px 0"}}>
              <div className="col-sm-5">
                <div className="row">
                  <div className="col-sm-auto">
                    <img className="upload_img upload_img_bdr" src={project && project.project_thumbnail && project.project_thumbnail.publicUrl} />
                  </div>
                  <div className="col">
                    <div className="row">
                      <div className="col">
                        {project && project.project_name}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        {project && !_.isEmpty(project.project_issue_area) && project.project_issue_area[0].display_name}
                      </div>
                    </div>
                    <div className="row">
                      {this._renderProjectCommunity()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
              </div>
              <div className="col col-sm-3">
                <div className="row">
                  {this._renderProjectHomepageLink()}
                </div>
                <div className="row">
                  {this._renderProjectLocation()}
                </div>
                <div className="row">
                  <ContactProjectButton project={this.state.project}/>
                  { CurrentUser.isLoggedIn() && !CurrentUser.isEmailVerified() && <VerifyEmailBlurb/> }
                </div>
              </div>
            </div>
          </div>

          {
            project && !_.isEmpty(project.project_technologies)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">TECHNOLOGIES USED</h2>
                    <div className="Text-section">
                      {this._renderTechnologies()}
                    </div>
                  </div>
                </div>
              : null
          }


          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className="col">
              <h2 className="form-group subheader">PROJECT DETAILS</h2>
              <div className="Text-section" style={{whiteSpace: "pre-wrap"}}>
                {project && project.project_description}
              </div>
            </div>
          </div>

          <NotificationModal
            showModal={this.state.showPositionModal}
            message={this.state.shownPosition && this.state.shownPosition.description}
            buttonText="Close"
            headerText={this.state.shownPosition && this.state.shownPosition.roleTag.display_name}
            onClickButton={() => this.setState({showPositionModal: false})}
          />

          {
            project && !_.isEmpty(project.project_positions)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">OPEN POSITIONS</h2>
                    <div className="Text-section">
                      {this._renderPositions()}
                    </div>
                  </div>
                </div>
              : null
          }

          {
            project && !_.isEmpty(project.project_links)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">LINKS</h2>
                    <div className="Text-section">
                      {this._renderLinks()}
                    </div>
                  </div>
                </div>
              : null
          }

          {
            project && !_.isEmpty(project.project_files)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">FILES</h2>
                    <div className="Text-section">
                      {this._renderFiles()}
                    </div>
                  </div>
                </div>
              : null
          }
        </div>
      </div>
    );
  }

  _renderProjectLocation(): React$Node {
    if(this.state.project && this.state.project.project_location && (this.state.project.project_location !== Locations.OTHER)) {
      return <div className="col">
        <i className="fa fa-map-marker fa-1" aria-hidden="true"></i>
        {this.state.project.project_location}
      </div>
    }
  }

  _renderProjectCommunity(): React$Node {
    if(this.state.project && !_.isEmpty(this.state.project.project_organization)) {
      return <div className="col">
        Community: {this.state.project.project_organization[0].display_name}
      </div>
    }
  }

  _renderProjectHomepageLink(): React$Node {
    if(this.state.project && this.state.project.project_url) {
      return <div className="col">
        <i className="fa fa-link fa-1" aria-hidden="true"></i>
        <a href={this.state.project.project_url} target="_blank" rel="noopener noreferrer">
          {this.state.project.project_url.length > 100 ? "Project Homepage" : url.beautify(this.state.project.project_url)}
        </a>
      </div>
    }
  }

  _renderTechnologies(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_technologies &&
      <TagsDisplay tags={project && project.project_technologies}/>
  }


  _renderLinks(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_links && project.project_links.map((link, i) =>
      <div key={i}>
        <a href={link.linkUrl} target="_blank" rel="noopener noreferrer">{this._legibleName(link.linkName)}</a>
      </div>
    );
  }

  _renderFiles(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_files && project.project_files.map((file, i) =>
      <div key={i}>
        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
      </div>
    );
  }

  _renderPositionsOld(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_positions && project.project_positions.map((position, i) =>
      <div key={i}>
        <span className="pseudo-link" onClick={this.showPositionModal.bind(this,position)}>{position.roleTag.display_name}</span>
      </div>
    );
  }

  _renderPositions(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_positions && project.project_positions.map((position, i) => {
      const positionDisplay = position.roleTag.subcategory + ":" + position.roleTag.display_name;
      return (
          <div key={i}>
          {
            position.descriptionUrl
            ? <a href={position.descriptionUrl} target="_blank" rel="noopener noreferrer">{positionDisplay}</a>
            : <span>{positionDisplay}</span>
          }
          </div>
        );
    });
  }

  _legibleName(input) {
    //replaces specific linkNames for readability
    const linkNames= {
      'link_coderepo': "Code Repository",
      'link_messaging': "Messaging",
      'link_filerepo': "File Repository",
      'link_projmanage': "Project Management"
    };
    if(input in linkNames) {
      return linkNames[input]
    } else {
      return input
    }
  }

  showPositionModal(position: PositionInfo): void {
    this.setState({
      showPositionModal: true,
      shownPosition: position
    });
  }
}

export default AboutProjectController;
