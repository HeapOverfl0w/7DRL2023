import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import {Button, Grid, MenuItem, Paper, Select, TextField, Tooltip} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DetailsIcon from '@material-ui/icons/Details';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 16,
    width: 16,
  },
}));

const lcolors = [
  "White",
  "Aqua",
  "Aquamarine",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
];

const textures = [
  "enemyturret", 
  "enemyturretdestroyed", 
  "enemyturretattack", 
  "computerdesk", 
  "pottedplant", 
  "drywall", 
  "drywalldoor",
  "trashcan", 
  "couch", 
  "sparks",
  "defaultScrewDriver", 
  "attackScrewDriver", 
  "brick", 
  "billboards", 
  "floors", 
  "enemyshot",
  "pistolpowerup",
  "bulletprojectile",
  "attackPistol",
  "defaultPistol",
  "ammopowerup",
  "healthpowerup",
  "vent",
  "cobblestone",
  "cobblestonetall",
  "fireaxe",
  "fireaxeattack",
  "fireaxepowerup",
  "bluesparks",
  "npc_melee_attack",
  "npc_melee_move",
  "ar",
  "arattack",
  "arreload",
  "arpowerup",
  "carpet",
  "wallpaper",
  "brickwindow",
  "ceilingDryWall",
  "wallpaperdoor",
  "wallpapervent",
  "elevatordoors",
  "pistolreload",
  "deaddude",
  "fridge",
  "comfychair",
  "tv",
  "bed",
  "endtable",
  "statue",
  "enemyrangedmove",
  "enemyrangeddeath",
  "enemyrangedattack",
  "streetlamp",
  "exitsign",
  "cardboardbox",
  "bush",
  "shotgun",
  "shotgunattack",
  "shotgunreload",
  "shotgunpowerup",
  "shotgunblast",
  "hellraiser",
  "hellraiserattack",
  "hellraiserdeath",
  "introtoc",
  "darkblades",
  "introtocattack",
  "introtocpowerup",
  "grass",
  "sidewalk1",
  "sidewalk2",
  "sidewalk3",
  "sidewalk4",
  "sidewalk5",
  "sidewalk6",
  "sidewalk7",
  "sidewalk8",
  "sidewalk9",
  "sidewalk10",
  "sidewalk11",
  "sidewalk12",
  "sidewalk13",
  "sidewalk14",
  "sidewalk15",
  "sidewalk16",
  "sidewalk17",
  "sidewalk18",
  "concrete1",
  "concrete2",
  "concrete3",
  "concrete4",
  "concrete5",
  "concrete6",
  "concrete7",
  "concrete8",
  "concrete9",
  "concrete10",
  "concrete11",
  "concrete12",
  "concrete13",
  "crosswalk1",
  "crosswalk2",
  "bossroomwall",
  "bossroomwall1",
  "bossroomfloor",
  "bossroomfloor1",
  "bossroomwallwires",
  "evilfire",
  "boss",
  "bossattack",
  "bosssecondattack",
  "bossteleport",
  "bossroomfloorlit",
  "bossdeath",
  "intro_scene1",
  "intro_scene2",
  "cleanwhitewall",
  "blackfloorshiny",
  "serverrack1",
  "serverrack2",
  "cleanwhitewalldoorclosed",
  "cleanwhitewalldooropen",
  "bluecarpet",
  "azurecloudsign",
  "bossroomdoor",
  "intro_scene0",
  "death_cutscene",
  "endgame_scene0",
  "endgame_scene1",
  "endgame_scene2",
  "endgame_scene3",
  "endgame_scene4",
  "elevatorbroken",
  "wallpapermailboxes",
  "guardsheddoor",
  "guardshedwall",
  "guardshedcorner",
  "fence",
  "lockeddoorwallpaper",
  "brokendoorwallpaper-2",
  "stairs",
  "empty",
  "stairsup",
  "grasstuft",
  "bluesiding",
  "bluesidingwindow",
  "bluesidingopendoor",
  "cobblestonetalldooropen",
  "cobblestonetallblockeddoor",
  "cobblestonetallwindow",
  "roadblocktall",
  "teleport",
  "car",
  "fortsign",
  "apartmentrubble",
  "os2floppy",
  "os2floppyattack",
  "os2floppypowerup",
  "greenslicesprojectile",
  "treadmill",
  "benchpress",
  "dumbells"
];

function App() {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [billboards, setBillboards] = useState([]);
  const [layer, setLayer] = useState('tile');
  const [tile, setTile] = useState(0);
  const [billboard, setBillboard] = useState('');
  const [update, setUpdate] = useState(false);

  const [mouseDown, setMouseDown] = useState(false);

  const initialize = function(value) {
    let bRows = [];

    while (bRows.length < value.length) {
      let tempB = [];
      while (tempB.length < value[0].length) {
        tempB.push('');
      }
      bRows.push(tempB);
    }
    setWidth(value[0].length);
    setHeight(value.length);
    setBillboards(bRows);
    setTiles(value);
  }

  const updateHeight = function(value) {
    let temp = tiles;
    let tempB = billboards;

    while(temp.length < value || tempB.length < value) {
      let defRow = [];
      let defRowB = [];
      for (let i = 0; i < width; i++) {
        defRow.push(0);
        defRowB.push('');
      }

      if (temp.length < value) {
        temp.push(defRow);
      }
      if (tempB.length < value) {
        tempB.push(defRowB);
      }
    }

    while(temp.length > value || tempB.length > value) {
      if (temp.length > value) {
        temp.pop();
      }
      if (tempB.length > value) {
        tempB.pop();
      }    
    }
    
    setTiles(temp);
    setBillboards(tempB);
    setHeight(value);
  }

  const updateWidth = function(value) {
    let temp = tiles;
    let tempB = billboards;

    temp.forEach(row => {
      while(row.length < value) {
        row.push(0);
      }

      while(row.length > value) {
        row.pop();
      }
    });

    tempB.forEach(row => {
      while(row.length < value) {
        row.push('');
      }

      while(row.length > value) {
        row.pop();
      }
    });

    setTiles(temp);
    setBillboards(tempB);
    setWidth(value);
  }

  const updateTile = function(e) {
    setTile(e.target.value);
  }

  const switchLayer = function(e) {
    setLayer(e.target.value);
  }

  const switchBillboard = function(e) {
    setBillboard(e.target.value);
  }

  const updateLevel = function(i, j, tile, billboard) {
    if (layer === 'tile') {
      let temp = tiles;  
      temp[i][j] = tile;
      setTiles(temp);
    }
    else {
      let tempB = billboards;
  
      tempB[i][j] = billboard;
      setBillboards(tempB);
    }
    setUpdate(!update);
  }

  const updateMouseDown = function(value){
    setMouseDown(value);
  }

  const handleImport = function(files) {
  // files is a FileList of File objects. List some properties.
  var json = '';
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (e) {
				try {
          json = JSON.parse(e.target.result);
          if (layer === 'tile') {
            initialize(json);
          }
          else {
            let temp = billboards;
            for(let b = 0; b < json.length; b++) {
              let x = Math.floor(json[b]['x']);
              let y = Math.floor(json[b]['y']);
              temp[x][y] = json[b]['type'];
            }
            setBillboards(temp);
            setUpdate(!update);
          }
				} catch (ex) {
					alert('ex when trying to parse json = ' + ex);
				}
			}
		})(f);
		reader.readAsText(f);
	}
  }

  const generate = function() {
    let t = [];
    let b = [];

    for (let i = 0; i < tiles.length; i++){
      let tr = [];
      for (let j = 0; j < tiles[i].length; j++) {
        tr.push(tiles[i][j]);
        if (billboards[i][j]) {
          b.push({type: billboards[i][j], x: i + .5, y: j + .5});
        }
      }
      t.push(tr);
    }

    let element1 = document.createElement("a");
    let tf = new Blob([JSON.stringify(t)], {type: 'text/plain'});
    element1.href = URL.createObjectURL(tf);
    element1.download = "tiles.json";
    document.body.appendChild(element1); 
    element1.click();

    let element4 = document.createElement("a");
    let bf = new Blob([JSON.stringify(b)], {type: 'text/plain'});
    element4.href = URL.createObjectURL(bf);
    element4.download = "billboards.json";
    document.body.appendChild(element4); 
    element4.click();
  }

  return (
    <div className="App">
      <div style={{width: '100%'}}>
        <input
          type="file"
          onChange={ (e) => handleImport(e.target.files) }
        />
        <Select
          value={layer}
          style={{verticalAlign:'bottom'}}
          onChange={(e) => switchLayer(e)}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={'tile'}>Tiles</MenuItem>
          <MenuItem value={'billboard'}>Billboards</MenuItem>
        </Select>  
        <TextField
          label="Height"
          type="number"
          value={height}
          onChange={(e) => updateHeight(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Width"
          type="number"
          value={width}
          onChange={(e) => updateWidth(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        { layer !== 'billboard' &&
          <TextField
            label="Tile"
            type="number"
            value={tile}
            onChange={(e) => updateTile(e)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        }
        { layer === 'billboard' &&
          <Select
            value={billboard}
            style={{verticalAlign:'bottom'}}
            onChange={(e) => switchBillboard(e)}
            displayEmpty
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={''}>None</MenuItem>
            {
              textures.map((texture, i) => (
                <MenuItem key={i} value={texture}>{texture}</MenuItem>
              ))
            }
          </Select>
        }
      </div>
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}} onMouseDown={() => updateMouseDown(true)} onMouseUp={() => updateMouseDown(false)}>
        <div style={{flexDirection: 'column', height: 'fit-content', borderWidth: '2px', borderColor: 'black', borderStyle: 'solid', display: 'grid', overflow: 'auto'}}>
          { tiles.map((row, i) => (
            <Grid key={i} container spacing={0} >
              <Grid item xs={12} >
                  <Grid  container justifyContent="center" spacing={0} style={{flexWrap: 'noWrap'}}>
                    {row.map((column, j) => (
                      <Grid key={j} item>
                        <Paper square className={classes.paper} style={{backgroundColor: lcolors[tiles[i][j]]}} 
                          onDragStart={(e) => {e.preventDefault()}} 
                          onMouseOver={() => {if (mouseDown)updateLevel(i, j, Number(tile), billboard)}}>
                          {/*onClick={() => updateLevel(i, j, Number(tile))}>*/}
                          {billboards[i][j] !== '' &&
                            <Tooltip title={billboards[i][j]}>
                              <DetailsIcon style={{display: 'block', fontSize: 'medium'}}/>
                            </Tooltip>
                          }
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
              </Grid>
            </Grid>
          ))}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px', height: '80%'}}>
          { lcolors.map((color, i) => (
            <Paper style={{backgroundColor: color, color: 'white'}}>{i}</Paper>
          ))}
        </div>
      </div>

      <Button onClick={() => generate()}>
        Generate
      </Button>
    </div>
  );
}

export default App;
