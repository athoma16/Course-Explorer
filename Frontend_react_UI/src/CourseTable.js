import React, { Component } from "react";
import {Menu, Modal} from "semantic-ui-react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import {TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import IconButton from '@material-ui/core/IconButton';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Alert from "@material-ui/lab/Alert";
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from "@material-ui/core";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

export default class CourseTable extends Component {
    state={
        courses: this.props.courses,
        message: null,
        orderBy: "code",
        order: "asc",
        email: "",
        snackSeverity: "",
        snackMessage: "",
        snackOpen: false,
        rowsPerPage: 50,
        page: 0,
    }

    componentDidMount(){
      window.scrollTo(0,0);
   }

    handleChangePage = (event, newPage) => {
      this.setState({page: newPage})
    }

   handleChangeRowsPerPage = (event) => {
     this.setState({rowsPerPage: parseInt(event.target.value)})
     this.setState({page: 0})
   };

    handleItemClick = (e, { name }) => {
        if (name === "New Search" || name === "Refine Search" || name === "Graph" || name === "List" || name === "Help") {
            this.props.navigate_to(name);
        }
    }
    handleSortChange = (e) => {

        if(e.target.value === "inital"){
            // filter the courses where DE is true
            const courses = this.props.courses
            this.setState({courses})
        }


        // Checking if the value is Distant education or not
        if(e.target.value === "DE"){
            // filter the courses where DE is true
            const courses = this.props.courses.filter(el=> el.de)
            this.setState({courses})
            // If there are courses the message would be null
            if(courses.length > 0) this.setState({message: null});
            // If there is not any course the message would be the following
            else this.setState({message: `No distance education courses were found for the semester chosen`})
        }

        if(e.target.value === "1000" || e.target.value === "2000" || e.target.value === "3000" || e.target.value === "4000"){
            // Getting the value of Selected option
            const filterNumber = + e.target.value
            // Filter the courses
            const courses = this.props.courses.filter(el=>{
                const number = +el.code.split("*")[1];
                // if the numberis greater than the selected option and is between the range of that number then return true
                return number > filterNumber && number < (filterNumber + 1000)
            })
            if (e.target.value === "inital"){
                console.log("Hello World made it inside default")
            }
            this.setState({courses})
        }
    }

    handleSubmit = (e) => {

      var alert = "email=" + this.state.email + "&course=" + e;
      var xhr = new XMLHttpRequest();
      var response;

      xhr.open("POST", 'https://cis4250-10.socs.uoguelph.ca/api/email/');
      xhr.onload = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            response = JSON.parse(xhr.response);
            if(response.result === "invalid"){
               this.setState({
                    snackMessage: "Invalid Email Address! Please Try Again.",
                    snackSeverity: "error",
                    snackOpen: true
                })
            } else if (response.result === "incomplete") {
                this.setState({
                    snackMessage: "Missing Email Address! Please Try Again.",
                    snackSeverity: "error",
                    snackOpen: true
                })
            } else if (response.result === "duplicate") {
                this.setState({
                    snackMessage: "Email Alert Prievously Submitted",
                    snackSeverity: "info",
                    snackOpen: true
                })
            } else if (response.status === "OK") {
                this.setState({
                    snackMessage: "Email Alert Submitted Successfully",
                    snackSeverity: "success",
                    snackOpen: true
                })
            }
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
      };
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         console.log("alert = " + alert);
      xhr.send(alert);
    }

    handleClose = (e, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setState({snackOpen: false});
    }

    handleAddress = (e) => {
      if(e.target.id === "email-address"){
         this.setState({email: e.target.value})
      }
   }

    avail = (el) =>{
      if(el.availability > 0){
         return el.availability;
      }
      else{
         return (
            <div>{el.availability}
                 <Modal
                 trigger={
                    <IconButton aria-label="alert" size="small">
                     <AddAlertIcon/>
                    </IconButton>}
                 header={"Add availability alert for " + el.code}
                 content={
                    <div class="field">
                    <div class="ui form" id="alert-form">
                        <label id="email-label">Enter your University of Guelph e-mail address</label>
                        <input type="text" placeholder="yourID@uoguelph.ca" value={this.state.email} id="email-address" onChange={this.handleAddress}></input>
                    </div>
                    <div id="alert-description">
                        You will receive an e-mail when this course has at least one open space.<br></br>
                        Your alert for this class will then automatically be cancelled.
                    </div>
                    </div>
                 }
                 actions={[{key: 'cancel', content: 'Cancel', positive: true},
                           {key: 'submit', content: 'Submit', positive: true, onClick: () => this.handleSubmit(el.code)}]}
                 />

                <Snackbar open={this.state.snackOpen} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert variant="filled" onClose={this.handleClose} severity={this.state.snackSeverity}>
                        {this.state.snackMessage}
                    </Alert>
                </Snackbar>
             </div>
         )
      }
    }

    render() {
        const activeItem = this.props.activeItem;
        const columns = [
            {filed: 'code',headerName: "Course Code",
            extra: <><select class="ui search dropdown" id="filter-dropdown" value={this.state.selectSort}
            onChange={this.handleSortChange}>
            <option value='inital' >All courses</option>
            <option value='4000'>4000 Level</option>
            <option value='3000' >3000 Level</option>
            <option value='2000' >2000 Level</option>
            <option value='1000' >1000 Level</option>
            <option value='DE'>Distance Education</option>
    </select></>},
            {filed: 'title',headerName: "Title"},
            {filed: 'prerequisites',headerName: "Prerequisites"},
            {filed: 'credit',headerName: "Credit"},
            {filed: 'semester',headerName: "Semesters"},
            {filed: 'department',headerName: "Department"},
            {filed: 'equate',headerName: "Equate"},
            {filed: 'de',headerName: "DE",},
            {filed: 'availability',headerName: "Availability"},
            {filed: 'capacity',headerName: "Capacity"},
        ];
        const handleRequestSort = (event, property) => {
            const isAsc = this.state.orderBy === property && this.state.order === 'asc';
            this.setState({order: isAsc ? 'desc' : 'asc',orderBy: property})
          };

        // console.log(this.state.courses)
        const createSortHandler = (property) => (event) => {
            handleRequestSort(event, property);
          };

        if(this.state.courses != null && this.state.courses.length > 0){

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
                <TableContainer style={{height: "100vh"}} component = {Paper}>
                <Table stickyHeader>
                <TableHead>
                    <TableRow>
                    {columns.map(headCell=>
                        <TableCell>
                            <TableSortLabel
                                className="table_cell"
                                active={this.state.orderBy === headCell.filed}
                                direction={this.state.orderBy === headCell.filed ? this.state.order : 'asc'}
                                onClick={createSortHandler(headCell.filed)}
                                >
                                {headCell.headerName}
                                    <span>
                                {this.state.orderBy === headCell.filed ? (
                                        <span className="visually_hidden">{this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                                ) : null}
                                    </span>
                            </TableSortLabel>
                            {headCell?.extra}
                        </TableCell>)}
                    </TableRow>
                </TableHead>

                <TableBody>

                {
                    this.state.courses.length > 0 ? stableSort(this.state.courses, getComparator(this.state.order, this.state.orderBy)).slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(el => {
                    return (
                    <TableRow key = {el.code}>
                        <TableCell component ="th" id={el.code}>{el.code}</TableCell>
                        <TableCell>
                           <Modal
                              trigger={<Button color="Primary" style={{textAlign: 'left'}}>{el.title}</Button>}
                              header= {"(" + el.code + ") - " + el.title}
                              content={el.description}
                              actions={[{ key: 'done', content: 'Done', positive: true }]}
                           />
                        </TableCell>
                        <TableCell>{el.prerequisites.join(', ')}</TableCell>
                        <TableCell>{el.credit}</TableCell>
                        <TableCell>{el.semesters}</TableCell>
                        <TableCell>{el.department}</TableCell>
                        <TableCell>{el.equate}</TableCell>
                        <TableCell>{el.de.toString()}</TableCell>
                        <TableCell>{this.avail(el)}</TableCell>
                        <TableCell>{el.capacity}</TableCell>
                    </TableRow>
                    );
                }) : this.state.message && <TableRow>
                <TableCell colSpan={10}>
                    {this.state.message}
                </TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
               rowsPerPageOptions={[50]}
               component = "div"
               count={this.state.courses.length}
               rowsPerPage = {this.state.rowsPerPage}
               page = {this.state.page}
               onChangePage={this.handleChangePage}
               />

        </div>
     );}
     else{
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
           <div>
               <p id = "no-results">
               No courses match your search, please try again.
               </p>
           </div>
           </div>

        )
     }
    }
};
