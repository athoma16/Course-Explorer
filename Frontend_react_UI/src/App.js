import React, { Component } from "react";
import CourseTable from "./CourseTable";
import CourseGraph from "./CourseGraph";
import Search from "./Search";
import Help from "./Help";
import {Typography} from "@material-ui/core";

class App extends Component {
  state = {
    activeItem: 'New Search',
    courses: null,
    searchState: null,
    help: "Help"
  }

  navigate_to = (page) => this.setState({activeItem: page})

  setCourses = (courses, graphs) => this.setState({courses: courses, graphs: graphs});

  setPrevSearchState = (prevState) => this.setState({searchState: prevState});

  render() {

    // TABLE
    if (this.state.activeItem === 'List') {
      return (
          <div>
             <Typography  variant ='h3' component='h1' align = 'center'>Course Explorer</Typography>
            {this.state.loading ? (
                <div>
                  <h3>Loading ...</h3>
                </div>
              ) : (
                <div>
                  <CourseTable navigate_to={this.navigate_to} courses={this.state.courses} activeItem={this.state.activeItem}/>
                </div>
              )}
          </div>
      );

    // GRAPH
    } else if (this.state.activeItem === 'Graph') {
      return (
          <div>
             <Typography  variant ='h3' component='h1' align = 'center'>Course Explorer</Typography>
            {this.state.loading ? (
                <div>
                  <h3>Loading ...</h3>
                </div>
            ) : (
                <div>
                  <CourseGraph navigate_to={this.navigate_to} graph_data={this.state.graphs} activeItem={this.state.activeItem}/>
                </div>
            )}
          </div>
      );

    // HELP 
    } else if (this.state.activeItem === 'Help') {
      return (
        <div>
            <Typography  variant ='h3' component='h1' align = 'center'>Course Explorer</Typography>
            {this.state.loading ? (
                <div>
                  <h3>Loading ...</h3>
                </div>
            ) : (
                <div>
                  <Help navigate_to={this.navigate_to} activeItem={this.state.activeItem}/>
                </div>
            )}
          </div>
      );

    // NEW SEARCH
    } else if (this.state.activeItem === 'New Search') {
      return (
          <div>
              <Search navigate_to={this.navigate_to} setCourses={this.setCourses} setPrevState={this.setPrevSearchState} prevState={null}/>
          </div>
      );
    }

    //REFINE SEARCH
    else if (this.state.activeItem === 'Refine Search') {
      return (
          <div>
              <Search navigate_to={this.navigate_to} setCourses={this.setCourses} setPrevState={this.setPrevSearchState} prevState={this.state.searchState}/>
          </div>
      );
    }

  }
}

export default App;
