import React, { Component } from "react";
import {Menu} from "semantic-ui-react";
import Typography from '@material-ui/core/Typography';
import search from './search.png';
import list from './list.png';
import graph from './graph.png';
import notification from './notification.png';

import {
    Container,
    Grid,
    Header,
    Divider
  } from "semantic-ui-react";

export default class Help extends Component {
    state={
        courses: this.props.courses,
        message: null
    }

    handleItemClick = (e, { name }) => {
        if (name === "New Search" || name === "Graph" || name === "List" || name === "Help" || name === "Refine Search") {
            this.props.navigate_to(name);
        }
    }

    render() {
        const activeItem = this.props.activeItem;

        return (
            <div>
            <Menu attached tabular inverted menu>
                <Menu.Item
                    name='List'
                    active={activeItem === 'List'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='Graph'
                    active={activeItem === 'Graph'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='Help'
                    active={activeItem === 'Help'}
                    onClick={this.handleItemClick}
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                    name='Refine Search'
                    active={activeItem === 'Refine Search'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='New Search'
                    active={activeItem === 'New Search'}
                    onClick={this.handleItemClick}
                    />
                </Menu.Menu>
            </Menu>

            {/* <div class="ui divider"></div>
            <Typography variant="h3" style={{ textAlign: "center"}} gutterBottom>
                    How can we help?
                    <Typography variant="h5" >
                    <Typography variant="h5" >-</Typography> 
                    <em>Course Explorer</em> is derived of three main sections, starting with the Advanced
                    Search proceeded by the results. Results can be viewed in two different formats, 
                    List and Graph. Upon clicking "Go" after entering in your search criteria users 
                    will land on the List view by default. Click between the List and Graph tabs on
                    the top left hand of your search results page to switch between views. For more
                    information about each section of <em>Course Explorer,</em> please see below. 
                    </Typography>
            </Typography>
            <div class="ui divider"></div> */}

            <div className="App">  
            <div class="ui divider"></div>
                <Container>
                <Typography variant="h3" gutterBottom>
                    How can we help?
                    <Typography variant="h5" >-</Typography>  
                    <Typography variant="h5" >
                    <em>Course Explorer</em> is derived of three main features, starting with the Advanced
                    Search followed by the results. Results can be viewed in two different formats, 
                    List and Graph. Clicking "Go" after entering in your search criteria will send users 
                    to the List view by default. Click between the List and Graph tabs on
                    the top-left hand side of your search results page to switch between views. For more
                    information about each section of <em>Course Explorer,</em> please see below. 
                    </Typography>
                </Typography>
                </Container>
            <div class="ui divider"></div>

            <Container>
                <Grid stackable columns="two">
                <Grid.Column>
                    <img src={search} alt="Search" />
                    <Header as="h1">Advanced Search</Header>
                    <p>
                    <em>Course Explorer's</em> Advanced Search is designed for easy, detailed course searching.
                    With clearly defined search fields, the user can easily customize their search to ma
                    their needs. All fields are optional so users may view all available course data by
                    entering no search field information if they please.</p>
                    <p>All data is updated each morning 
                    to offer new, accurate data each day directly from The University of Guelph. 
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <img src={list} alt="List" />
                    <Header as="h1">List View</Header>
                    <p>
                    The List view is the default view users will see after 
                    entering their search. The scrollable table-view offers an easy 
                    method of browsing course results in a clean, straightforward 
                    manner. Certain columns can also be sorted to help better your 
                    search. The column <em>Course Code</em> offers a dropdown menu allowing 
                    users to sort according to course level. Click on the titles of
                    columns <em>Title, Credit, Availability</em> and <em>Capacity</em> to sort 
                    alphabetically and by total values. 
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <img src={graph} alt="Graph" />
                    <Header as="h1">Graph View</Header>
                    <p>
                    For users wanting a more visual representation of their course search results, 
                    click on the Graph tab. Here, users can see all the courses returned from 
                    their search represented as nodes, as well as their connection to other 
                    courses from the same search. A colour coded legend is provided to help 
                    categorize courses where the colour is the department it falls in. Click 
                    on a specific node to see the prerequisites (green vector) and the successors 
                    (red vector) of the course. You can zoom in and out of the graph using the
                    scroll wheel and pan the graph using the mouse. Nodes can be dragged around 
                    as needed.
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <img src={notification} alt="Notification" />
                    <Header as="h1">Mailing List</Header>
                    <p>
                    Most users partaking  in a course search are most likely curious about the 
                    availability of a course. With our <em>Has Availability</em> search field, users can narrow down
                    their search results more specifically. However if the particular course you
                    are interested in does not currently have any available slots, you can register for
                    an email notification when slots open up. Click the "bell" icon in the Availability
                    column for the course you'd like to be notified about. Enter in your email address
                    and you will receive an email update if any slots open up. This eliminates the need 
                    to constantly manually check the application in hopes of catching an opening in the course.
                    </p>
                </Grid.Column>
                </Grid>
                <Divider hidden />
                <Divider />
                <a href="#root">Back to top</a>
                <div class="ui divider"></div>
            </Container>
            </div>
            </div>
        );
    }
};
