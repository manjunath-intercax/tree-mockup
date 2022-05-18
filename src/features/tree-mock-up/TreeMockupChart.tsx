import * as React from 'react';
import { fetchRepositoriesAsync, selectRepositories } from './treeMockupSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
const TreeMockupChart = () => {
  const repositories = useAppSelector(selectRepositories);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(fetchRepositoriesAsync())
  }, [])

  React.useEffect(() => {
    if (repositories?.length) {

      cytoscape.use(dagre)
      const nodes: Array<any> = [{
        data: { id: 'rootNode' }
      }];
      const edges: Array<any> = [];
      repositories.forEach(repository => {
        nodes.push({
          data: { id: repository?.node_id }
        })
        edges.push({ data: { source: 'rootNode', target: repository?.node_id } })
        if (repository?.pullRequests?.length) {
          repository.pullRequests.forEach(pullRequest => {
            nodes.push({
              data: { id: pullRequest?.node_id }
            })
            edges.push({ data: { source: repository?.node_id, target: pullRequest?.node_id } })
            if (pullRequest?.files?.length) {
              pullRequest.files.forEach(fileEntry => {
                nodes.push({
                  data: { id: fileEntry?.sha }
                })
                edges.push({ data: { source: pullRequest?.node_id, target: fileEntry?.sha } })
              })
            }
          })
        }
      })
      const cy = cytoscape({
        container: document.getElementById('cytoscape-container'),
        boxSelectionEnabled: false,
        autounselectify: true,
        layout: {
          name: 'dagre',
          fit: true,
          padding: 40,
        },
        style: [
          {
            selector: "label",
            css: {
              label: "data(id)", //The text to display for an element’s label (demo).
              //source-label : The text to display for an edge’s source label.
              //target-label : The text to display for an edge’s target label.

              color: "#9e9e9e", //The colour of the element’s label.
              //"text-opacity": "0.87",             //The opacity of the label text, including its outline.
              "font-family": "Nokia Pure Regular", //A comma-separated list of font names to use on the label text.
              "font-size": "10px", //The size of the label text.
              //font-style : A CSS font style to be applied to the label text.
              //font-weight: "",                    //A CSS font weight to be applied to the label text.
              "text-transform": "uppercase", //A transformation to apply to the label text; may be none, uppercase, or lowercase.

              "text-wrap": "ellipsis", //A wrapping style to apply to the label text; may be none for no wrapping (including manual newlines: \n), wrap for manual and/or autowrapping, or ellipsis to truncate the string and append ‘…’ based on text-max-width. Note that with wrap, text will always wrap on newlines (\n) and text may wrap on any breakable whitespace character — including zero-width spaces (\u200b).
              "text-max-width": "80", //The maximum width for wrapped text, applied when text-wrap is set to wrap or ellipsis. For only manual newlines (i.e. \n), set a very large value like 1000px such that only your newline characters would apply.
              //text-overflow-wrap : The characters that may be used for possible wrapping locations when a line overflows text-max-width; may be whitespace (default) or anywhere. Note that anywhere is suited to CJK, where the characters are in a grid and no whitespace exists. Using anywhere with text in the Latin alphabet, for example, will split words at arbitrary locations.
              //text-justification** : The justification of multiline (wrapped) labels; may be left, center, right, or auto (default). The auto value makes it so that a node’s label is justified along the node — e.g. a label on the right side of a node is left justified.
              "line-height": 16, //The line height of multiline text, as a relative, unitless value. It specifies the vertical spacing between each line. With value 1 (default), the lines are stacked directly on top of one another with no additional whitespace between them. With value 2, for example, there is whitespace between each line equal to the visible height of a line of text.

              "text-valign": "bottom", //The vertical alignment of a node’s label; may have value left, center, or right.
              "text-halign": "center", //The vertical alignment of a node’s label; may have value top, center, or bottom.

              //source-text-offset : For the source label of an edge, how far from the source node the label should be placed.
              //target-text-offset : For the target label of an edge, how far from the target node the label should be placed.

              "text-margin-x": 5, //A margin that shifts the label along the x-axis.
              "text-margin-y": 4, //A margin that shifts the label along the y-axis.
              //source-text-margin-x : (For the source label of an edge.)
              //source-text-margin-y : (For the source label of an edge.)
              //target-text-margin-x : (For the target label of an edge.)
              //target-text-margin-y : (For the target label of an edge.)

              //text-rotation : A rotation angle that is applied to the label.
              //source-text-rotation : (For the source label of an edge.)
              //target-text-rotation : (For the target label of an edge.)

              //text-outline-color : The colour of the outline around the element’s label text.
              //text-outline-opacity : The opacity of the outline on label text.
              //text-outline-width : The size of the outline on label text.

              "text-background-color": "#ebebeb", //A colour to apply on the text background.
              "text-background-shape": "roundrectangle", //The shape to use for the label background, can be rectangle or round-rectangle.
              "text-background-padding": "3px" //A padding on the background of the label (e.g 5px); zero padding is used by default.
            }
          },

          //NODE
          {
            selector: "node",
            css: {
              width: "38px", //The width of the node’s body.
              height: "38px", //The height of the node’s body.
              //"shape-polygon-points": ""  //An array (or a space-separated string) of numbers ranging on [-1, 1], representing alternating x and y values (i.e. x1 y1 x2 y2, x3 y3 ...). This represents the points in the polygon for the node’s shape. The bounding box of the node is given by (-1, -1), (1, -1), (1, 1), (-1, 1). The node’s position is the origin (0, 0).

              //"background-color": "#05A18F", //The colour of the node’s body.
              //"background-blacken": "",  //Blackens the node’s body for values from 0 to 1; whitens the node’s body for values from 0 to -1.
              //"background-opacity": "", ////The opacity level of the node’s background colour.
              //"background-fill": "", //The filling style of the node’s body; may be solid (default), linear-gradient, or radial-gradient.

              //"background-gradient-stop-colors": "",  //The colours of the background gradient stops (e.g. cyan magenta yellow).
              //"background-gradient-stop-positions": "",   //The positions of the background gradient stops (e.g. 0% 50% 100%). If not specified or invalid, the stops will divide equally.
              //"background-gradient-direction": "",  //For background-fill: linear-gradient, this property defines the direction of the background gradient.

              //"border-width": "",  //The size of the node’s border.
              //"border-style": "",  //The style of the node’s border; may be solid, dotted, dashed, or double.
              //"border-color": "",  //The colour of the node’s border.
              //"border-opacity": "",  //The opacity of the node’s border.

              //"padding": "",  //The amount of padding around all sides of the node. Either percentage or pixel value can be specified. For example, both 50% and 50px are acceptable values. By default, percentage padding is calculated as a percentage of node width.
              //"padding-relative-to": "",  //Determines how padding is calculated if and only if the percentage unit is used. Accepts one of the keywords specified below.

              //"compound-sizing-wrt-labels": "",  //Whether to include labels of descendants in sizing a compound node; may be include or exclude.
              //"min-width": "",  //Specifies the minimum (inner) width of the node’s body for a compound parent node (e.g. 400px). If the biases for min-width do not add up to 100%, then the biases are normalised to a total of 100%.
              //"min-width-bias-left": "",  //When a compound node is enlarged by its min-width, this value specifies the percent of the extra width put on the left side of the node (e.g. 50%).
              //"min-width-bias-right": "",  //When a compound node is enlarged by its min-width, this value specifies the percent of the extra width put on the right side of the node (e.g. 50%).
              //"min-height": "",  //Specifies the minimum (inner) height of the node’s body for a compound parent node (e.g. 400px). If the biases for min-height do not add up to 100%, then the biases are normalised to a total of 100%.
              //"min-height-bias-top": "",  //When a compound node is enlarged by its min-height, this value specifies the percent of the extra width put on the top side of the node (e.g. 50%).
              //"min-height-bias-bottom": "",  //When a compound node is enlarged by its min-height, this value specifies the percent of the extra width put on the bottom side of the node (e.g. 50%).

              //"background-image": draw.svg("./imgs/ic_equipment_ne.svg").fill("#ffffff"),//"./imgs/ic_equipment_ne.svg", //The URL that points to the image that should be used as the node’s background. PNG, JPG, and SVG are supported formats.
              //"background-image-crossorigin": "", //All images are loaded with a crossorigin attribute which may be anonymous or use-credentials. The default is set to anonymous.
              //"background-image-opacity": "", //The opacity of the background image.
              "background-width": "24px", //Specifies the width of the image. A percent value (e.g. 50%) may be used to set the image width relative to the node width. If used in combination with background-fit, then this value overrides the width of the image in calculating the fitting — thereby overriding the aspect ratio. The auto value is used by default, which uses the width of the image.
              "background-height": "24px" //Specifies the height of the image. A percent value (e.g. 50%) may be used to set the image height relative to the node height. If used in combination with background-fit, then this value overrides the height of the image in calculating the fitting — thereby overriding the aspect ratio. The auto value is used by default, which uses the height of the image.
              //"background-fit": "", //How the background image is fit to the node; may be none for original size, contain to fit inside node, or cover to cover the node.
              //"background-repeat": "", //Whether to repeat the background image; may be no-repeat, repeat-x, repeat-y, or repeat.
              //"background-position-x: "", //The x position of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
              //"background-position-y: "", //The y position of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
              //"background-offset-x: "", //The x offset of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
              //"background-offset-y: "", //The y offset of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
              //"background-width-relative-to: "", //Changes whether the width is calculated relative to the width of the node or the width in addition to the padding; may be inner or include-padding. If not specified, include-padding is used by default.
              //"background-height-relative-to: "", //Changes whether the height is calculated relative to the height of the node or the height in addition to the padding; may be inner or include-padding. If not specified, include-padding is used by default.
              //"background-clip: "", //How background image clipping is handled; may be node for clipped to node shape or none for no clipping.
              //"bounds-expansion": "2px" //Specifies a padding size (e.g. 20px) that expands the bounding box of the node in all directions. This allows for images to be drawn outside of the normal bounding box of the node when background-clip is none. This is useful for small decorations just outside of the node. bounds-expansions accepts 1 value (for all directions), 2 values, ([topAndBottom, leftAndRight]) or 4 values ([top, right, bottom, left]).
            }
          },
          {
            selector: "node.hover",
            css: {
              "background-color": "#6e6e6e",
              "border-width": "4px",
              "border-color": "#5da4ef",
              "bounds-expansion": "0px"
            }
          },
          {
            selector: "node:selected",
            css: {
              "background-color": "#9e9e9e",
              "border-width": "4px",
              "border-color": "#5DA4EF",
              "bounds-expansion": "0px"
            }
          },
          {
            selector: "node:selected.hover",
            css: {
              "background-color": "#6e6e6e",
              "border-width": "4px",
              "border-color": "#5da4ef",
              "bounds-expansion": "0px"
            }
          },
          {
            selector: "edge",
            style: {
              width: 1,
              "line-color": "#b8b8b8",
              "curve-style": "bezier",

              //LABEL
              label: ""
            }
          },
          {
            selector: "edge.hover",
            style: {
              width: 2,
              "line-color": "#239df9"
            }
          },
          {
            selector: "edge:selected",
            style: {
              width: 1,
              "line-color": "#239df9"
            }
          }
        ],
        elements: {
          nodes: nodes,
          edges: edges
        }
      });

      cy.viewport({
        zoom: .7,
        pan: {
          x: 50,
          y: 50
        }
      })      
      cy.height()
      cy.width()
      //NODE EVENTS
      cy.on("mouseover", "node", function (e) {
        e.target.addClass("hover");
      });
      cy.on("mouseout", "node", function (e) {
        e.target.removeClass("hover");
      });

      cy.on("mousedown", "node", function (e) {
        e.target.addClass("hover");
      });

      //EDGES EVENTS  
      cy.on("mouseover", "edge", function (e) {
        e.target.addClass("hover");
      });
      cy.on("mouseout", "edge", function (e) {
        e.target.removeClass("hover");
      });
    }
  }, [repositories]);
  return (
    <div style={{ background: '#fff', width: '100%', height: '100%', display: 'flex' }}>
      {repositories?.length > 0 ? <div id="cytoscape-container" /> : ''}
    </div>
  );
}

export default TreeMockupChart;