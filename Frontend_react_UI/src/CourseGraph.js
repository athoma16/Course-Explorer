import React, { Component } from "react";
import {Menu} from "semantic-ui-react"; //install package using ( npm install semantic-ui-react semantic-ui-css)
import * as d3 from "d3";

export default class CourseGraph extends Component {

    state = {
        selectSort: 'Default'
    }

    handleItemClick = (e, { name }) => {
        if (name === "New Search" || name === "Refine Search" || name === "Graph" || name === "List" || name === "Help") {
            this.props.navigate_to(name);
        }
    }

    componentDidMount() {

        /////////
        // Sample DATA
        /*
        const sample =  {
            nodes: [
                // id,label,course,department,capacity,availability,%full
                {id: 0, label: 'Introduction to Computer Applications', course: 'CIS*1000', department: 'School of Computer Science', capacity: 100,},
                {id: 1, label: 'Web Design and Development', course: 'CIS*1050', department: 'School of Computer Science', capacity: 98,},
                {id: 2, label: 'Introduction to Computing', course: 'CIS*1200', department: 'School of Computer Science', capacity: 92,},
            ],
            links: [
                // source,target,type,weight,category
                {source: 6, target: 7, type: 'directed', weight: 0.2, category: 2},
                {source: 11, target: 7, type: 'directed', weight: 0.2, category: 2},
                {source: 2, target: 8, type: 'directed', weight: 0.15, category: 3},
            ]
        };*/

        const dataset = this.props.graph_data
        if ((dataset === undefined) || !('nodes' in dataset) || !('links' in dataset)){
            return
        }
        const links = dataset['links'].map(d => Object.create(d));
        const nodes = dataset['nodes'].map(d => Object.create(d));


        //////////
        // CONFIG

        const height = document.body.clientHeight - 130 - 42 - 10; // - 130 - 42 exact, -10 for extra padding
        const width = document.body.clientWidth;
        const colour = d3.scaleOrdinal(d3.schemeTableau10);


        /////////////////////
        // FORCE SIMULATION

        // https://github.com/d3/d3-force/blob/v2.1.1/README.md#forceSimulation
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-30))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // re-draw
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
        });

        const drag = simulation => {

            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }


        //////////
        // CANVAS

        // main canvas
        const svg = d3.select("#graph-obj")
            .append("svg")
            .attr("viewBox", [0, 0, width, height]);

        // group containing all nodes and links
        const g = svg.append('g');

        // zoom
        svg.call(d3.zoom().on('zoom', ({transform}) => {
            g.attr("transform", transform);
        }))

        // arrowhead to be used as marker-end in links
        svg.append('defs').append('marker')
            .attr("id",'arrowhead')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX',40.5)
            .attr('refY',0)
            .attr('orient','auto')
            .attr('markerWidth',6)
            .attr('markerHeight',6)
            .attr('xoverflow','visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke','none');

        // links
        const link = g.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr('marker-end','url(#arrowhead)')
            .attr("id",d=> `line${d.source.index}-${d.target.index}`)
            .attr("stroke-width", 0.3);

        // main node group
        const node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("g")
            .attr("class", "nodes")
            .call(drag(simulation));

        // node
        node.append("circle")
            .attr("stroke", "#FCF7EE")
            .attr("stroke-width", 1.5)
            .attr("r", 5)
            .attr("id",d=> "circle"+d.id)
            .attr("fill", d => colour(d.department));

        // node text
        node.append("text")
            .attr("dx", 8)
            .attr("dy", ".35em")
            .attr("font-size", 4)
            .attr("stroke-width", 0)
            .attr("font-family", "Roboto")
            .style("pointer-events", "none")
            .text(d => d.course);

        // node hint
        node.append("title")
            .text(d => d.label + " - " + d.department +" - capacity: "+ d['%full']+ "%");


        ///////////////////
        // PRE-REQ LINKING

        //set up dictionary of neighbors
        let i, id;
        let neighbourTarget= {};
        for (i=0; i < dataset.nodes.length; i++ ){
            id = nodes[i].id;
            neighbourTarget[id] = links.filter(function(d){
                return d.source.index === id;
            }).map(function(d){
                return d.target.index;
            });
        }
        let neighbourSource = {};
        for (i=0; i < nodes.length; i++ ){
            id = nodes[i].id;
            neighbourSource[id] = links.filter(function(d){
                return d.target.index === id;
            }).map(function(d){
                return d.source.index;
            });
        }

        // on click
        node.selectAll("circle").on("click",function(event, d){

            let active = d.active ? false : true // toggle whether node is active
            let newLineStrokeIn = active ? "green" : "#999"
            let newLineStrokeOut = active ? "red" : "#999"
            let newNodeStroke = active ? "yellow" : "#FCF7EE"
            let newNodeStrokeIn = active ? "green" : "#FCF7EE"
            let newNodeStrokeOut = active ? "red" : "#FCF7EE"
            let newOpacity = active? 0.6 : 1

            //extract node's id and ids of its neighbors
            let i, id = d.id
            let neighborS = neighbourSource[id]
            let neighborT = neighbourTarget[id];
            d3.selectAll("#circle"+id).style("stroke-opacity", newOpacity);
            d3.selectAll("#circle"+id).style("stroke", newNodeStroke);

            //highlight the current node and its neighbors
            for (i = 0; i < neighborS.length; i++){
                d3.selectAll("#line"+neighborS[i]+"-"+id)
                    .style("stroke", newLineStrokeIn);
                d3.selectAll("#circle"+neighborS[i])
                    .style("stroke-opacity", newOpacity)
                    .style("stroke", newNodeStrokeIn);
            }
            for (i = 0; i < neighborT.length; i++){
                d3.selectAll("#line"+id+"-"+neighborT[i])
                    .style("stroke", newLineStrokeOut);
                d3.selectAll("#circle"+neighborT[i])
                    .style("stroke-opacity", newOpacity)
                    .style("stroke", newNodeStrokeOut);
            }
            //update whether or not the node is active
            d.active = active;
        });

        //////////
        // LEGEND

        // container
        let padding_hidden = 23
        const legend_box = svg.selectAll("rect")
            .data([{active:true}])
            .enter()
            .append("rect")
            .attr("fill", "#FCF7EE")
            .attr("opacity", 0.93)
            .attr('rx', 6)
            .attr("x", 20)
            .attr("y", 20)
            .attr("width", 460)
            .attr("height", () => padding_hidden + colour.domain().length * 20)

        // hide/unhide text
        const hide_text = svg
            .data([{active:true}])
            .append("g")
            .attr("cursor", "pointer")
            .attr("transform", (d, i) => `translate(40, 35)`)
            .attr("font-weight", "800")
            .append("text").text("< < Toggle Legend > >");

        // legend group
        const legend_g = svg.selectAll(".legend")
            .data(colour.domain())
            .enter()
            .append("g")
            .attr("opacity", "1")
            .attr("transform", (d, i) => `translate(30,${ padding_hidden + (i * 20) + 30})`);

        // legend group -> colour
        legend_g.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("fill", colour);

        // legend group -> department
        legend_g.append("text")
            .attr("x", 10)
            .attr("y", 5)
            .text(d => d);

        hide_text.on("click",function(event, d){
            let hide_padding = 23;

            let active = d.active ? false : true // toggle whether legend is active or not
            if (active) {

                // show legend
                legend_g.transition()
                    .duration(600)
                    .attr("transform", (d, i) => `translate(30,${hide_padding + (i * 20) + 30})`)
                    .attr("opacity", "1");

                legend_box.transition()
                    .duration(600)
                    .attr("height", () => hide_padding + colour.domain().length * 20);

            } else {

                // hide legend
                legend_g.transition()
                    .duration(600)
                    .attr("transform", (d, i) => `translate(30,${hide_padding + 30})`)
                    .attr("opacity", "0");

                legend_box.transition()
                    .duration(600)
                    .attr("height", () => hide_padding);
            }

            //update whether or not the legend is active
            d.active = active;
        });

    }

    shouldComponentUpdate() {
        return false;
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
        const activeItem = this.props.activeItem
        if(this.props.graph_data !== undefined && this.props.graph_data.nodes.length > 0){
        return (
            <>
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
                <div id="graph-obj" ref={this._setRef.bind(this)} />
            </>
        );
     } else{
        return(
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
