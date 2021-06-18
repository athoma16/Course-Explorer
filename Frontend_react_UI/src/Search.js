import React, {Component} from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import "./Search.css"
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Checkbox} from 'semantic-ui-react'


const styles = (theme) => ({
    root: {
        flexGrow: 1,
        color: "grey"
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
});


class Search extends Component {

    state = {
        keyword: "",
        code: "",
        title: true,
        description: false,
        creditType: "Exactly",
        credit: "",
        semester_fall: false,
        semester_summer: false,
        semester_winter: false,
        department: "",
        de: null,
        de_any: true,
        de_no: false,
        de_yes: false,
        availability: null,
        avail_any: true,
        avail_no: false,
        avail_yes: false,
        courses: null,
        graph: null,
        loading: false
    }

    componentDidMount() {
        if (this.props.prevState != null) {
            this.setState({keyword: this.props.prevState.keyword,
            code: this.props.prevState.code,
            title: this.props.prevState.title,
            description: this.props.prevState.description,
            creditType: this.props.prevState.creditType,
            credit: this.props.prevState.credit,
            semester_fall: this.props.prevState.semester_fall,
            semester_summer: this.props.prevState.semester_summer,
            semester_winter: this.props.prevState.semester_winter,
            department: this.props.prevState.department,
            de: this.props.prevState.de,
            de_any: this.props.prevState.de_any,
            de_yes: this.props.prevState.de_yes,
            de_no: this.props.prevState.de_no,
            availability: this.props.prevState.availability,
            avail_any: this.props.prevState.avail_any,
            avail_yes: this.props.prevState.avail_yes,
            avail_no: this.props.prevState.avail_no,
        })
        }
    }

    handleSearch = (e) => {
        var result = e.target.value.split(" ").join("_")
        if (e.target.id === "keyword") {
            this.setState({keyword: result})
        }
        else if (e.target.id === "keyword_inTitle"  && e.target.checked) {
            this.setState({title: true})
        }
        else if (e.target.id === "keyword_inDescription" && e.target.checked) {
            this.setState({description: true})
        }
        else if (e.target.id === "keyword_inTitle"  && !e.target.checked) {
            this.setState({title: false})
        }
        else if (e.target.id === "keyword_inDescription" && !e.target.checked) {
            this.setState({description: false})
        }
        else if (e.target.id === "code") {
            this.setState({code: result})
        }
        else if (e.target.id === "creditType") {
            this.setState({creditType: result})
        }
        else if (e.target.id === "credit") {
            this.setState({credit: result})
        }
        else if (e.target.id === "semester_fall" && e.target.checked) {
            this.setState({semester_fall: true})
        }
        else if (e.target.id === "semester_winter" && e.target.checked) {
            this.setState({semester_winter: true})
        }
        else if (e.target.id === "semester_summer" && e.target.checked) {
            this.setState({semester_summer: true})
        }
        else if (e.target.id === "semester_fall" && !e.target.checked) {
            this.setState({semester_fall: false})
        }
        else if (e.target.id === "semester_winter" && !e.target.checked) {
            this.setState({semester_winter: false})
        }
        else if (e.target.id === "semester_summer" && !e.target.checked) {
            this.setState({semester_summer: false})
        }
        else if (e.target.id === "department") {
            this.setState({department: result})
        }
        else if (e.target.id === "de_any" && e.target.checked) {
            this.setState({de: null,
                de_any: true,
                de_no: false,
                de_yes: false,})
        }
        else if (e.target.id === "de_yes" && e.target.checked) {
            this.setState({de: true,        
                de_any: false,
                de_no: false,
                de_yes: true,})
        }
        else if (e.target.id === "de_no" && e.target.checked) {
            this.setState({de: false,
                de_any: false,
                de_no: true,
                de_yes: false,})
        }
        else if (e.target.id === "avail_any"  && e.target.checked) {
            this.setState({availability: null,
                avail_any: true,
                avail_no: false,
                avail_yes: false,})
        }
        else if (e.target.id === "avail_yes"  && e.target.checked) {
            this.setState({availability: true,
                avail_any: false,
                avail_no: false,
                avail_yes: true,})
        }
        else if (e.target.id === "avail_no" && e.target.checked) {
            this.setState({availability: false,
                avail_any: false,
                avail_no: true,
                avail_yes: false,})
        }
    }

    callAPI = async (urls) => {
        const responseTable = await fetch(urls[0]);
        const dataTable = await responseTable.json();
        const responseGraph = await fetch(urls[1]);
        const dataGraph = await responseGraph.json();
        this.setState({courses: dataTable, graph: JSON.parse(dataGraph)});
    }

    handleGo = async () => {
        var urls = this.getURL();
        this.setState({loading: true});
        await this.callAPI(urls);
        this.filterCourses(this.state.courses, this.state.graph);
        this.props.setCourses(this.state.courses, this.state.graph);
        this.props.setPrevState(this.state);
        this.props.navigate_to("List");
        this.setState({loading: false});
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.handleGo();
        }
    }

    handleClear = () => {
        this.setState({
            keyword: "",
            code: "",
            title: true,
            description: false,
            creditType: "Exactly",
            credit: "",
            semester_fall: false,
            semester_summer: false,
            semester_winter: false,
            department: "",
            de: null,
            de_any: true,
            de_no: false,
            de_yes: false,
            availability: null,
            avail_any: true,
            avail_no: false,
            avail_yes: false,
            courses: null,
            graph: null,
            loading: false
        })
    }

    handleHelp = () => {
        this.props.navigate_to("Help");
    }

    getURL = () => {
        var urlTable = "https://cis4250-10.socs.uoguelph.ca/api/"
        var urlGraph = "https://cis4250-10.socs.uoguelph.ca/api/json/"
        var urls = [urlTable, urlGraph]
        var methods = ['search', 'json']
        for (const [index, method] of methods.entries()) {
            if (this.state.code !== "") {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/code/${this.state.code}/`
            } else if (this.state.keyword !== "" && this.state.title) {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/title/${this.state.keyword}/`
            } else if (this.state.keyword !== "" && this.state.description) {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/description/${this.state.keyword}/`
            } else if (this.state.credit !== "" && this.state.creditType === "Exactly") {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/credit/${this.state.credit}/`
            } else if (this.state.semester_fall !== false) {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/semester/f/`
            } else if (this.state.semester_winter !== false) {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/semester/w/`
            } else if (this.state.semester_summer !== false) {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/semester/s/`
            } else if (this.state.department !== "") {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/department/${this.state.department}/`
            } else if (this.state.de !== null) {
                urls[index] = `https://cis4250-10.socs.uoguelph.ca/api/${method}/de/${this.state.de}/`
            }
        }
        return urls
    }

    filterCourses = (courses, graph_courses) => {
        if (this.state.keyword !== "" && this.state.title) {
            this.state.keyword.split("_").map(key => {return( courses = courses.filter(course => course.title.toLowerCase().search(key.toLowerCase()) !== -1))})
        }
        if (this.state.description !== "" && this.state.description) {
            this.state.keyword.split("_").map(key => {return ( courses = courses.filter(course => course.description.toLowerCase().search(key.toLowerCase()) !== -1))})
        }
        if (this.state.credit !== "" && this.state.creditType !== "") {
            if (this.state.creditType === "Exactly") {
                this.state.credit.split("_").map(key => {return ( courses = courses.filter(course => course.credit === parseFloat(key)))})
            }
            else if (this.state.creditType === "At_Least") {
                this.state.credit.split("_").map(key => {return ( courses = courses.filter(course => course.credit >= parseFloat(key)))})
            }
            else if (this.state.creditType === "No_More_Than") {
                this.state.credit.split("_").map(key => {return ( courses = courses.filter(course => course.credit <= parseFloat(key)))})
            }
        }
        if (this.state.semester_fall !== false) {
            courses = courses.filter(course => course.semesters.find(sem => sem.toLowerCase() === "f") !== undefined)
        }
        if (this.state.semester_winter !== false) {
            courses = courses.filter(course => course.semesters.find(sem => sem.toLowerCase() === "w") !== undefined)
        }
        if (this.state.semester_summer !== false) {
            courses = courses.filter(course => course.semesters.find(sem => sem.toLowerCase() === "s") !== undefined)
        }
        if (this.state.department !== "") {
            this.state.department.split("_").map(key => {return ( courses = courses.filter(course => course.department.toLowerCase().search(key.toLowerCase()) !== -1))})
        }
        if (this.state.de !== null) {
            courses = courses.filter(course => course.de === this.state.de)
        }
        if (this.state.availability !== null) {
            if (this.state.availability === true) {
                courses = courses.filter(course => course.availability > 0)
            }
            else {
                courses = courses.filter(course => course.availability === 0)
            }
        }
        this.setState({courses: courses, graph: this.mirrorCoursesAsGraph(courses, graph_courses)})
    }

    mirrorCoursesAsGraph = (courses, graph_courses) => {
        // 12: {id: 12, label: "Computer Engineering Design IV", course: "ENGG*4170", department: "School of Engineering", capacity: 33, …}
        // 13: {id: 13, label: "Advanced Computer Architecture", course: "ENGG*4540", department: "School of Engineering", capacity: 44, …}
        // 17: {capacity: 0, availability: 0, id: 17, label: "CIS*3110", course: "CIS*3110", …}
        // 16: {capacity: 0, availability: 0, id: 16, label: "CIS*2500", course: "CIS*2500", …}
        // 0: {type: "directed", weight: 0.2, source: 200, target: 4, category: 4}
        // 1: {type: "directed", weight: 0.2, source: 201, target: 5, category: 0}
        let kept = []; // course IDs to keep
        for (const course of courses) {
            kept.push(course['code']);
        }

        let new_nodes = [];
        let new_links = [];
        let synthetic_nodes = [];

        let nodes = graph_courses['nodes'];
        let links = graph_courses['links'];

        let removed = [];  // course IDs to remove
        let synthetic = []; // synthetic nodes

        for (const node of nodes) {
            if (node['label'] === node['course']) {
                synthetic.push(node['id']);
                synthetic_nodes.push(node);
            } else if (kept.includes(node['course'])) {
                new_nodes.push(node);
            } else {
                removed.push(node['id']);
            }
        }

        for (const link of links) {
            if (!removed.includes(link['source']) && !removed.includes(link['target'])) {
                // link is not between a removed node
                if (synthetic.includes(link['source']) || synthetic.includes(link['target'])){
                    // link is between a synthetic node
                    for (const [index, synth] of synthetic_nodes.entries()) {
                        if (synth['id'] === link['source'] || synth['id'] === link['target']) {
                            new_nodes.push(synthetic_nodes[index]);
                            delete synthetic_nodes[index];
                            synthetic_nodes[index] = {'id': -1};
                            break;
                        }
                    }
                }
                new_links.push(link);
            }
        }

        return {'nodes': new_nodes, 'links': new_links};
    }

    render() {

        return (
            <Paper style={styles.paperContainer}>
                <Grid container spacing={3} justify = "center" id="main-background">
                    <Grid item xs={12} style={{ textAlign: "center"}} id="main-header">
                        <Typography variant="h3" gutterBottom>
                            Course Explorer
                        </Typography>
                        <div class="ui divider"></div>
                        <Typography variant="h6" gutterBottom id="subtitle">
                            <em>Course searching for the University of Guelph made easy.</em>
                        </Typography>
                    </Grid>

                    <Grid item xs={6} id="search-form-border">
                        <div class="column">

                            <form action="https://s.codepen.io/voltron2112/debug/PqrEPM?" method="get" class="ui large form">
                            <div class="ui stacked secondary  segment" id="search-form">

                                <div class="field">
                                <Typography variant="h6" gutterBottom>
                                  Enter the details of your search: <em>(all fields optional)</em>
                                  <div onClick={this.handleClear} id="clearAll" class="ui secondary button">Clear All Fields</div>
                                </Typography>
                                </div>

                                <div class="ui divider"></div>

                                <div class="field">
                                <div class="ui form">
                                    <label>Keyword(s):</label>
                                    <input type="text" placeholder="Enter a keyword" value={this.state.keyword.split("_").join(" ")} id="keyword" onChange={this.handleSearch} onKeyDown={this.handleKeyDown}></input>      
                                </div>
                                </div>

                                <div class="field" style={{ textAlign: "center"}}>
                                <div class="ui form">
                                    <Checkbox label=' In Title' id="keyword_inTitle" onChange={this.handleSearch} checked={this.state.title}/>
                                    <Checkbox label=' In Description' id="keyword_inDescription" onChange={this.handleSearch} checked={this.state.description}/>
                                </div>
                                </div>

                                <div class="field">
                                <div class="ui form">
                                    <label>Course Code:</label>
                                    <input type="text" placeholder="Enter a course code" value={this.state.code.split("_").join(" ")} id="code" onChange={this.handleSearch} onKeyDown={this.handleKeyDown}></input>
                                </div>
                                </div>

                                <div class="field">
                                <div class="ui form">
                                    <label>Number of Credits:</label>
                                        <select class="ui search dropdown" value={this.state.creditType} id="creditType" onChange={this.handleSearch}>
                                        <option value="Exactly">Exactly</option>
                                        <option value="At_Least">At Least</option>
                                        <option value="No_More_Than">No More Than</option>
                                        </select>
                                        <div class="ui input">
                                        <input type="text" placeholder="0.5" value={this.state.credit.split("_").join(" ")} id="credit" onChange={this.handleSearch} onKeyDown={this.handleKeyDown}></input>
                                        </div>
                                </div>
                                </div>

                                <div class="field" style={{ textAlign: "center"}}>
                                <div class="ui form">
                                    <label>Offered in Semester(s): </label>
                                    <Checkbox label=' Fall' id="semester_fall" onChange={this.handleSearch} checked={this.state.semester_fall}/>
                                    <Checkbox label=' Winter' id="semester_winter" onChange={this.handleSearch} checked={this.state.semester_winter}/>
                                    <Checkbox label=' Summer' id="semester_summer" onChange={this.handleSearch} checked={this.state.semester_summer}/>
                                </div>
                                </div>

                                <div class="field">
                                <div class="ui form">
                                    <label>Department:</label>
                                    <select class="ui search dropdown" id="department" value={this.state.department.split("_").join(" ")} onChange={this.handleSearch}>
                                    <option value="">Any</option>
                                    <option value="Associate VP Academic">Associate VP Academic</option>
                                    <option value="Co-operative Education & Career Services">Co-operative Education & Career Services</option>
                                    <option value="Dean's Office, College of Arts">Dean's Office, College of Arts</option>
                                    <option value="Dean's Office, College of Arts, Dean's Office, College of Biological">Dean's Office, College of Arts, Dean's Office, College of Biological</option>
                                    <option value="Dean's Office, College of Biological Science">Dean's Office, College of Biological Science</option>
                                    <option value="Dean's Office, College of Social and Applied Human Sciences">Dean's Office, College of Social and Applied Human Sciences</option>
                                    <option value="Dean's Office, Gordon S. Lang School of Business and Economics">Dean's Office, Gordon S. Lang School of Business and Economics</option>
                                    <option value="Dean's Office, Gordon S. Lang School of Business and Economics,">Dean's Office, Gordon S. Lang School of Business and Economics,</option>
                                    <option value="Dean's Office, Ontario Agricultural College">Dean's Office, Ontario Agricultural College</option>
                                    <option value="Dean's Office, Ontario Veterinary College">Dean's Office, Ontario Veterinary College</option>
                                    <option value="Dean's Office, Ontario Veterinary College, Department of Population">Dean's Office, Ontario Veterinary College, Department of Population</option>
                                    <option value="Department of Animal Biosciences">Department of Animal Biosciences</option>
                                    <option value="Department of Biomedical Sciences">Department of Biomedical Sciences</option>
                                    <option value="Department of Biomedical Sciences, Department of Clinical Studies">Department of Biomedical Sciences, Department of Clinical Studies</option>
                                    <option value="Department of Biomedical Sciences, Department of Pathobiology">Department of Biomedical Sciences, Department of Pathobiology</option>
                                    <option value="Department of Biomedical Sciences, Department of Population">Department of Biomedical Sciences, Department of Population</option>
                                    <option value="Department of Biomedical Sciences, School of Environmental Sciences">Department of Biomedical Sciences, School of Environmental Sciences</option>
                                    <option value="Department of Chemistry">Department of Chemistry</option>
                                    <option value="Department of Clinical Studies">Department of Clinical Studies</option>
                                    <option value="Department of Clinical Studies, Department of Population Medicine">Department of Clinical Studies, Department of Population Medicine</option>
                                    <option value="Department of Economics and Finance">Department of Economics and Finance</option>
                                    <option value="Department of Family Relations and Applied Nutrition">Department of Family Relations and Applied Nutrition</option>
                                    <option value="Department of Food Science">Department of Food Science</option>
                                    <option value="Department of Food Science, Department of Human Health and">Department of Food Science, Department of Human Health and</option>
                                    <option value="Department of Food, Agricultural and Resource Economics">Department of Food, Agricultural and Resource Economics</option>
                                    <option value="Department of Geography, Environment and Geomatics">Department of Geography, Environment and Geomatics</option>
                                    <option value="Department of History">Department of History</option>
                                    <option value="Department of Human Health and Nutritional Sciences">Department of Human Health and Nutritional Sciences</option>
                                    <option value="Department of Human Health and Nutritional Sciences, Department">Department of Human Health and Nutritional Sciences, Department</option>
                                    <option value="Department of Integrative Biology">Department of Integrative Biology</option>
                                    <option value="Department of Integrative Biology, Department of Molecular and">Department of Integrative Biology, Department of Molecular and</option>
                                    <option value="Department of Integrative Biology, School of Computer Science">Department of Integrative Biology, School of Computer Science</option>
                                    <option value="Department of Management">Department of Management</option>
                                    <option value="Department of Marketing and Consumer Studies">Department of Marketing and Consumer Studies</option>
                                    <option value="Department of Mathematics and Statistics">Department of Mathematics and Statistics</option>
                                    <option value="Department of Mathematics and Statistics, Department of Integrative">Department of Mathematics and Statistics, Department of Integrative</option>
                                    <option value="Department of Molecular and Cellular Biology">Department of Molecular and Cellular Biology</option>
                                    <option value="Department of Molecular and Cellular Biology, Department of">Department of Molecular and Cellular Biology, Department of</option>
                                    <option value="Department of Pathobiology">Department of Pathobiology</option>
                                    <option value="Department of Philosophy">Department of Philosophy</option>
                                    <option value="Department of Physics">Department of Physics</option>
                                    <option value="Department of Physics, Department of Mathematics and Statistics">Department of Physics, Department of Mathematics and Statistics</option>
                                    <option value="Department of Plant Agriculture">Department of Plant Agriculture</option>
                                    <option value="Department of Plant Agriculture, Department of Animal Biosciences">Department of Plant Agriculture, Department of Animal Biosciences</option>
                                    <option value="Department of Plant Agriculture, School of Environmental Sciences">Department of Plant Agriculture, School of Environmental Sciences</option>
                                    <option value="Department of Political Science">Department of Political Science</option>
                                    <option value="Department of Population Medicine">Department of Population Medicine</option>
                                    <option value="Department of Psychology">Department of Psychology</option>
                                    <option value="Department of Sociology and Anthropology">Department of Sociology and Anthropology</option>
                                    <option value="Department of Sociology and Anthropology, Department of Political">Department of Sociology and Anthropology, Department of Political</option>
                                    <option value="Provost & VP Academic">Provost & VP Academic</option>
                                    <option value="School of Computer Science">School of Computer Science</option>
                                    <option value="School of Engineering">School of Engineering</option>
                                    <option value="School of English and Theatre Studies">School of English and Theatre Studies</option>
                                    <option value="School of Environmental Design and Rural Development">School of Environmental Design and Rural Development</option>
                                    <option value="School of Environmental Sciences">School of Environmental Sciences</option>
                                    <option value="School of Fine Art and Music">School of Fine Art and Music</option>
                                    <option value="School of Hospitality, Food and Tourism Management">School of Hospitality, Food and Tourism Management</option>
                                    <option value="School of Languages and Literatures">School of Languages and Literatures</option>
                                    </select>
                                </div>
                                </div>

                                <div class="field" style={{ textAlign: "center"}}>
                                <div class="ui form">
                                    <Grid item xs={12} style={{ textAlign: "center"}}>
                                        <div>
                                            <label>Available in Distance Education Format:</label>
                                            <input type="radio" value="ANY" name="de" id="de_any" onChange={this.handleSearch} checked={this.state.de_any}/> Any
                                            <input type="radio" value="YES" name="de" id="de_yes" onChange={this.handleSearch} checked={this.state.de_yes}/> Yes
                                            <input type="radio" value="NO" name="de" id="de_no" onChange={this.handleSearch} checked={this.state.de_no}/> No
                                        </div>
                                    </Grid>
                                </div>
                                </div>

                                <div class="field" style={{ textAlign: "center"}}>
                                <div class="ui form">
                                    <Grid item xs={12} style={{ textAlign: "center"}}>
                                        <div>
                                            <label>Has Availability:</label>
                                            <input type="radio" value="ANY" name="availability" id="avail_any" onChange={this.handleSearch} checked={this.state.avail_any}/> Any
                                            <input type="radio" value="YES" name="availability" id="avail_yes" onChange={this.handleSearch} checked={this.state.avail_yes}/> Yes
                                            <input type="radio" value="NO" name="availability" id="avail_no" onChange={this.handleSearch} checked={this.state.avail_no}/> No
                                        </div>
                                    </Grid>
                                </div>
                                </div>

                                <div class="ui divider"></div>
                    
                                <div onClick={this.handleGo} class="ui fluid large teal submit button">Go</div>

                                <Grid item xs={12} style={{ textAlign: "center"}}>
                                    {this.state.loading ? (
                                            <CircularProgress/>
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                </Grid>

                            </div>
                            <div class="ui error message"></div>
                            </form>

                            <div class="ui message centered row" style={{ textAlign: "center"}} id="help-link">
                            Questions? Click here for <a href="#root" onClick={this.handleHelp}>Help</a>
                            </div>

                            {/* <div class="ui message centered row" style={{ textAlign: "center"}} id="help-link">
                            Questions? Click here for <a href="https://s.codepen.io/voltron2112/debug/PqrEPM?">Help</a>
                            </div> */}
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
};

export default withStyles(styles)(Search)
