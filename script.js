let masses = [];
let g = 1;
let center
let sidePanelWidth = 500;
let timeScale = 5;

let launched = false; 
let launchTime = 0;

let tableData = []

function setup()
{
    createCanvas(innerWidth, innerHeight);

    let centerX = innerWidth / 2 - sidePanelWidth;
    let centerY = innerHeight / 2;
    center = createVector(centerX, centerY)
    angleMode(DEGREES);

    masses.push(new Mass({
        name: "Sun", 
        pos: createVector(center.x, center.y), 
        color: "yellow", 
        radius: 30,
        // mass: 19891
        mass: 1989
    }))

    masses.push(new Mass({
        name: "Jupiter", 
        type: "Planet",
        daysInAYear: 4333,
        distanceToSun: 5.2, 
        mass: 18.986, 
        color: "brown",
        radius: 10
    }))

    masses.push(new Mass({
        name: "Saturn", 
        type: "Planet",
        // daysInAYear: 10759,
        daysInAYear: 2059,
        distanceToSun: 9.54, 
        // mass: 5.6846, 
        mass: 5684, 
        color: "red",
        radius: 10
    }))
    
    masses.push(new Mass({
        name: "Earth", 
        type: "Planet",
        daysInAYear: 365,
        distanceToSun: 1, 
        mass: 5.9736 * Math.pow(10, -2), 
        color: "blue",
        radius: 10
    }))
        
    // masses.push(new Mass({
    //     name: "Saturn", 
    //     type: "Planet",
    //     daysInAYear: 10759,
    //     distanceToSun: 95.4, 
    //     mass: 5.6846, 
    //     color: "red",
    //     radius: 10,
    //     vel: createVector(-5, 0)}))
}

function draw() 
{
    background(0);
    frameRate(30);

    masses.forEach(mass => 
    {
        
        mass.netForce()
        mass.move()
        mass.display()
    })

    if (!launched && launchTime < frameCount) 
    {
        launch();
        launched = true;  
    }

    push()
        fill(255)
        rect(innerWidth - sidePanelWidth, 0, sidePanelWidth, innerHeight)

        fill(0)
        
        for (let i = 30; i < innerHeight; i+= 30) 
        {
            stroke(0)
            line(innerWidth - sidePanelWidth, i, innerWidth, i)
            noStroke()
            text(i/30, innerWidth - sidePanelWidth + 10, i + 20)
        }

        tableData.forEach((row, i) => {
            let rowHeight = (30 * (i + 2)) - 10; 
            text(Math.round(row.pos.x), innerWidth - sidePanelWidth + 35, rowHeight)
            text(Math.round(row.pos.y), innerWidth - sidePanelWidth + 65,  rowHeight )
            text(row.vel.x.toFixed(3), innerWidth - sidePanelWidth + 110,  rowHeight )
            text(row.vel.y.toFixed(3), innerWidth - sidePanelWidth + 190,  rowHeight )
            text(row.acc.x.toFixed(3), innerWidth - sidePanelWidth + 280,  rowHeight )
            text(row.acc.y.toFixed(3), innerWidth - sidePanelWidth + 390,  rowHeight )
        })

        text("n", innerWidth - sidePanelWidth + 10,  20)
        text("x", innerWidth - sidePanelWidth + 40,  20)
        text("y", innerWidth - sidePanelWidth + 70,  20)
        text("velocity in x", innerWidth - sidePanelWidth + 110,  20)
        text("velocity in y", innerWidth - sidePanelWidth + 190,  20)
        text("acceleration in x", innerWidth - sidePanelWidth + 280,  20)
        text("acceleration in y", innerWidth - sidePanelWidth + 390,  20)

        stroke(0)
        line(innerWidth - sidePanelWidth + 30, 0, innerWidth - sidePanelWidth + 30, innerHeight)
        line(innerWidth - sidePanelWidth + 65, 0, innerWidth - sidePanelWidth + 60, innerHeight)
        line(innerWidth - sidePanelWidth + 100, 0, innerWidth - sidePanelWidth + 90, innerHeight)
        line(innerWidth - sidePanelWidth + 180, 0, innerWidth - sidePanelWidth + 180, innerHeight)
        line(innerWidth - sidePanelWidth + 260, 0, innerWidth - sidePanelWidth + 260, innerHeight)
        line(innerWidth - sidePanelWidth + 380, 0, innerWidth - sidePanelWidth + 380, innerHeight)
    pop()
}

function launch()
{
    console.log("launch");
    
    let lauchPlanet = masses.find(mass => mass.name == "Jupiter")

    masses.push(new Mass({
        name: "Satellite", 
        pos: lauchPlanet.pos.copy(), 
        color: "white", 
        radius: 10,
        mass: 1,
        vel: createVector(0, 0).rotate(100)
    }));
}

class Mass
{
    constructor(props)
    {
        this.pos = props.pos || createVector(0, 0);
        this.vel = props.vel || createVector(0, 0);
        this.acc = props.acc || createVector(0, 0);
        this.mass = props.mass || 1;
        this.radius = props.radius || 10;
        this.color = props.color || "red";
        this.name = props.name || "No Name";
        this.type = props.type;
        this.daysInAYear = props.daysInAYear / timeScale;
        this.distanceToSun = props.distanceToSun * 40;

        this.force = props.force || createVector(0, 0);
        this.trail = [];
    }
    


    display = function()
    {
        let mass = this;
        push()
            stroke(mass.color)
            fill(mass.color)
            ellipse(mass.pos.x, mass.pos.y, mass.radius, mass.radius)       

            if (mass.type == "Planet") 
            {
                noFill()
                ellipse(center.x, center.y, mass.distanceToSun * 2, mass.distanceToSun * 2)   
            }

            if (mass.trail.length > 5) 
            {
                for (let i = 0; i < mass.trail.length - 1; i++) 
                {
                    line(mass.trail[i].x, mass.trail[i].y, mass.trail[i + 1].x, mass.trail[i + 1].y)
                    
                }
            }
            
        pop()

        // console.log(mass);
    }

    move = function()
    {
        

        if (this.type == "Planet") 
        {
            let twoPI = 2 * Math.PI;
            this.pos.x = -(Math.cos((twoPI / this.daysInAYear)* frameCount) * this.distanceToSun) + center.x
            this.pos.y = (Math.sin((twoPI / this.daysInAYear)* frameCount) * this.distanceToSun) + center.y
        }
        else
        {
            this.trail.push(this.pos.copy())
            this.pos.add(this.vel);
            this.vel.add(this.acc);

            this.acc = this.force.div(this.mass)

            
            
        }

        if (this.name == "Satellite") 
        {
            if (frameCount % 4 == 0) 
            {
                tableData.push({pos: this.pos.copy(), vel: this.vel.copy(), acc: this.acc.copy()})
            }   
        }
    }

    netForce = function()
    {
        this.force = createVector(0, 0);

        masses.forEach(mass => 
        {
            let massPos = mass.pos;
            let massMass = mass.mass;
            
            let gm = massMass  * g;
            let r = p5.Vector.dist(this.pos, massPos);

            let count = true;
            if (r < 0.5) 
            {
                count = false;
            }
            let rSquared = Math.pow(r,2);
            let force = gm / rSquared;
        
            let theta = p5.Vector.sub(massPos, this.pos).heading();
            let forceX = force * cos(theta);
            let forceY = force * sin(theta);
        
            let forceVector = createVector(forceX, forceY);
        
            if (count) 
            {
                this.force.add(forceVector);
            }
            
        });
    }
  
}


function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    let centerX = innerWidth / 2 - sidePanelWidth;
    let centerY = innerHeight / 2;
    center = createVector(centerX, centerY)
    masses[0].pos = center;
}

