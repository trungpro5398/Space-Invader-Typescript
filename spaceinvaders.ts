import { fromEvent, interval, range, timer } from 'rxjs';
import { map, scan, filter , take,tap,startWith,flatMap,merge,
  withLatestFrom,
  takeUntil,
  repeat,
  mergeMap} from 'rxjs/operators';
function spaceinvaders() {
    // Inside this function you will use the classes and functions 
    // from rx.js
    // to add visuals to the svg element in pong.html, animate them, and make them interactive.
    // Study and complete the tasks in observable exampels first to get ideas.
    // Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/ 
    // You will be marked on your functional programming style
    // as well as the functionality that you implement.
    // Document your code!  
    
    const svg = document.getElementById("canvas")!;
    
    const tank = document.createElementNS(svg.namespaceURI, 'image');
    
    type Key = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'| 'Space';

    type Event = 'keydown' | 'keyup';

    type typeEntity = Readonly<{ 
      x : number,
      y : number,
      name?: String,
      width: number,
      height: number,
      href: String
      id: String
      xVelocity?: number,
      yVelocity?: number,
      visibility: String,
      countMove?: number,
    }>

    interface State {
      tank: typeEntity,
      invaders: ReadonlyArray<typeEntity>,
      tankbullets?: ReadonlyArray<typeEntity>,
      invaderbullet?: ReadonlyArray<typeEntity>,
      deadInvaders?: ReadonlyArray<typeEntity>,
      shield?: ReadonlyArray<typeEntity>,
      numOfShield?: number,
      hardGame:number,
      score: number,
      level: number,
      lives: ReadonlyArray<typeEntity>,
      endGame: boolean
    }
    
    const creatTank = () => <typeEntity>{
        id: 'tank',
        name:'tank',
        x : 400,
        y : 540,
        width: 50, 
        height: 50,
        href: 'image/tank.jpg',
        visibility: 'visible',
        xVelocity: 1,
        yVelocity: 1
    }
    
    ,createEntity = (entity: typeEntity) => <typeEntity>{
            name: entity.name,
            id: entity.id,
            x: entity.x,
            y: entity.y,
            width: entity.width,
            height: entity.height,
            href: entity.href,
            visibility: entity.visibility,
            xVelocity: entity.xVelocity,
            yVelocity: entity.yVelocity,
            countMove: 0
    }
    
    ,fastcreateUFO = (x: number, y: number, width: number, height: number, href: string, xVelocity:number, yVelocity:number) => 
    <typeEntity>createEntity({x : x, y: y, id: "UFO " + String(x*Math.random())  + String(y * Math.random()), href: href, visibility: 'visible', width: width, height: height,xVelocity:xVelocity,yVelocity: yVelocity, name: 'UFO'})
    ,fastInputCreateInvaderShot = (x: number, y: number, width: number, height: number) => <typeEntity>createEntity({x : x, y: y, id: "Invader shot " + String(x*Math.random())  + String(y * Math.random()), href: 'image/tankshot.png', visibility: 'visible', width: width, height: height,yVelocity:6, name: 'tank'} as typeEntity)
    
    ,fastInputCreateShiled = (x:number, y:number) =><typeEntity>createEntity({name:'shield',x : 385 + (x+1) * 2, y : 530 - 2 * (y+1), width: 4, height: 4, href: 'image/tankshot.png', id: "shiled " +String(x) + String(y), visibility: 'hidden'} as typeEntity)
    
    ,designShield = (column: number, row: number): typeEntity => {
      return column <= 2 ? fastInputCreateShiled(column,row) : column <= 4 ? fastInputCreateShiled(column,row+3): column <= 6 ? fastInputCreateShiled(column,row+9): column <= 8 ? fastInputCreateShiled(column, row+12):
      column <= 10 ? fastInputCreateShiled(column,row + 15): column <= 14 ? fastInputCreateShiled(column,row+18)
      : column <= 28 ? fastInputCreateShiled(column,row+18) : column <= 30 ? fastInputCreateShiled(column,row+15): column <= 32 ? fastInputCreateShiled(column,row+12) : column <= 34 ? fastInputCreateShiled(column,row+9)
      : column <= 36 ? fastInputCreateShiled(column,row +6 ): column <= 38? fastInputCreateShiled(column,row+3): fastInputCreateShiled(column,row)
    }
    ,fastcreateLives = (x: number, y: number, width: number, height: number, href: string, name:string) => Array.from(Array(3).keys()).reduce(
      (invds, column) => [...invds, {...createEntity({x : (x+(column+1) *40), y : y, width: width, height: height, href: href, id: String(x) + String(column), visibility: 'visible', name: name} as typeEntity)}],
      []) as Array<typeEntity>
    ,createColumnInvaders = (row:number, image: String, xVelocity: number, name_invader: String) => Array.from(Array(10).keys()).reduce(
    (invds, column) => [...invds, {...createEntity({x : (column+1) * 50, y : 60 * row, width: 20, height: 20, href: image, id: String(row) + String(column), xVelocity: xVelocity, yVelocity:0, visibility: 'visible', name: name_invader} as typeEntity)}],
    []) as Array<typeEntity>
    
    ,createColumnShield = (row:number) => Array.from(Array(40).keys()).reduce(
      (invds, column) => [...invds, {...designShield(column,row) as typeEntity}],
      []) as Array<typeEntity>
      
    const level1State: State = {
        tank: creatTank(),
        invaders: createColumnInvaders(1, 'image/a1.jpg', 2,'invader 1').concat(createColumnInvaders(2, 'image/a2.jpg', 2, 'invader 1')).concat(createColumnInvaders(3,'image/a5.jpg', 2, 'invader 3')),
        tankbullets: [],
        invaderbullet: [],
        deadInvaders: [],
        shield: Array.from({length: 15}, (_, index) => index + 1).reduce((acc, v) => acc.concat(createColumnShield(v)), []),
        numOfShield: 600,
        hardGame:1000,
        score: 0,
        level:1,
        lives: fastcreateLives(55,552,30,30,'image/tank.jpg','lives'),
        endGame: false
    }
    , level2State: State = {
      tank: creatTank(),
      invaders: createColumnInvaders(1, 'image/a1.jpg', 2,'invader 1').concat(createColumnInvaders(2, 'image/a6.jpg', 2, 'invader 3')).concat(createColumnInvaders(3,'image/a5.jpg', 2, 'invader 3')).concat(fastcreateUFO(20,30,30,40,'image/ufo.png',6,0)),
      tankbullets: [],
      invaderbullet: [],
      deadInvaders: [],
      shield: Array.from({length: 15}, (_, index) => index + 1).reduce((acc, v) => acc.concat(createColumnShield(v)), []),
      numOfShield: 600,
      hardGame:500,
      score: 0,
      level:2,
      lives: fastcreateLives(55,552,30,30,'image/tank.jpg','lives'),
      endGame: false
  }
    ,update = (state: State) => {
      const attr = (element: Element, obj: Object) => Object.keys(obj).map(key => element.setAttribute(key, String(obj[key])))
			
      ,updateEntityView = (entity: typeEntity) => {
        
          const createEntityView = () => {
					const entityE = document.createElementNS(svg.namespaceURI, 'image')!;
					attr(entityE, { id: entity.id, x: entity.x, y : entity.y, width: entity.width, height: entity.height, href: entity.href, visibility: entity.visibility, xVelocity: entity.xVelocity, yVelocity: entity.yVelocity});
					svg.appendChild(entityE);
					return entityE;
				  }
        ;
        const entityE = document.getElementById(String(entity.id)) || createEntityView();
       
				attr(entityE, { x: entity.x, y: entity.y, href: entity.href, visibility: entity.visibility});
      }
      
      updateEntityView(state.tank)
      state.invaders.forEach(x => updateEntityView(x))
      state.tankbullets.forEach(x => updateEntityView(x))
      state.deadInvaders.forEach(x => updateEntityView(x))
      state.shield.forEach(x => updateEntityView(x))
      state.invaderbullet.forEach(x => updateEntityView(x))
      state.lives.forEach(x => updateEntityView(x))
      console.log(state.lives.length)
      document.getElementById('score').textContent = `${state.score}`;
      document.getElementById('level').textContent = `${state.level}`;
    }
    
    
    

      // take arrow up and down input from user and pass paddle move, continuously until release key.
	  const keyObservable = <T>(k: Key, result: () => T) =>
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter(({ code }) => code === k),
      filter(({ repeat }) => !repeat),
      // flatMap((e) =>
      // interval(10).pipe(takeUntil(fromEvent<KeyboardEvent>(document, 'keyup').pipe(filter(({ code }) => code === e.code))))
      // ),
      map(result)
    ),
    up = keyObservable('ArrowUp', () => new Move(0,-20)),
    down = keyObservable('ArrowDown', () => new Move(0,20)),
    left = keyObservable('ArrowLeft', () => new Move(-20,0)),
    right = keyObservable('ArrowRight', () => new Move(20,0)),
    space = keyObservable('Space', () => new Shoot(0,-10))
    
// take Y axis value from mouse when inside canvas, limit to value in range of canvas then pass to follow which will then apply to paddle.

    const movingObj = (entity: typeEntity, direction: String) =><typeEntity>{ 
      ...entity,
      x: direction == 'right' ? entity.x + entity.xVelocity : entity.x - entity.xVelocity,
      y:  entity.countMove == 100 ? entity.y +10 : entity.y,
      countMove: entity.countMove == 200 ? 0 : entity.countMove,
      
    };
    const ufoMove = (entity: typeEntity, direction: String) =><typeEntity>{ 
      ...entity,
      x: direction == 'right' ? entity.x + entity.xVelocity : entity.x - entity.xVelocity,
      countMove: entity.countMove == 700 ? 0 : entity.countMove,
      
    };
    const countMove = (entity: typeEntity) =><typeEntity>{ 
      ...entity,
      countMove: entity.countMove + 1
    };
    const bulletMove = (entity: typeEntity) =><typeEntity>{ 
      ...entity,
      y: entity.y + entity.yVelocity 
    };
    const moveShield = (entity: typeEntity, xM: number, yM: number) =><typeEntity>{ 
      ...entity,
      x: entity.x + xM, 
      y: entity.y + yM
    }
    const handleCollisions = (s: State) => {
        const bulletCollideEntity = (bullet:typeEntity, entity:typeEntity) => Number(entity.y) <= Number(bullet.y) && Number(bullet.y) <= Number(entity.y + entity.height) && Number(entity.x) <= Number(bullet.x) && Number(bullet.x) <= Number(entity.x + entity.width)
        
        ,entityCollideBullet = (bullet:typeEntity, entity:typeEntity) => Number(bullet.y) <= Number(entity.y) && Number(entity.y) <= Number(bullet.y + bullet.height) && Number(bullet.x) <= Number(entity.x) && Number(entity.x) <= Number(bullet.x + bullet.width)
        
        ,checkEntityCollideBullet = (entitity: typeEntity, bullets: ReadonlyArray<typeEntity>, f:(bullet:typeEntity, entity: typeEntity) =>boolean): boolean => bullets.length == 0 ? true : bullets.filter( bullet => f(bullet, entitity) ).length <= 0 ? true: false 
        
        ,checkBulletCollideEntity = (bullet: typeEntity, entities: ReadonlyArray<typeEntity>, f:(bullet:typeEntity, entity: typeEntity) =>boolean): boolean => entities.length == 0 ? true : entities.filter(entity => f(bullet, entity)).length <= 0 ? true: false
        
        ,createDeadInvaderWhenBulletAndInvaderCollide = (entity: typeEntity) => createEntity({id:"dead id number : " + entity.id,x: entity.x, y: entity.y, href:'image/dying.png',width: 30, height: 30, visibility: 'visible', name : 'dead'} as typeEntity)
        
        return InputEvent ?
           s.endGame == false ?
           <State> {
            ...s,
            deadInvaders: s.deadInvaders.concat(s.invaders.filter( invader => !checkEntityCollideBullet(invader, s.tankbullets,bulletCollideEntity ))).concat(s.tankbullets.filter( bullet => !checkBulletCollideEntity(bullet, s.invaders,bulletCollideEntity ))).map( x => x.name != 'dead' ? removeChildNode(x) : x).
            filter(x=> x.name != 'TankShot').map(x => x.name != 'dead'?createDeadInvaderWhenBulletAndInvaderCollide(x) : x),
            invaders: s.invaders.filter( invader => checkEntityCollideBullet(invader, s.tankbullets,bulletCollideEntity )),
            tankbullets: s.tankbullets.filter( bullet => checkBulletCollideEntity(bullet, s.invaders,bulletCollideEntity )),
            shield: s.shield.map(shield => checkEntityCollideBullet(shield,s.invaderbullet,entityCollideBullet) ? shield: removeChildNode(shield)).filter(shield => checkEntityCollideBullet(shield,s.invaderbullet,entityCollideBullet))
            .map(shield => s.shield.length != s.numOfShield? {...shield, visibility: 'visible'} : {...shield, visibility: 'hidden'}),
            invaderbullet: s.invaderbullet.map(invaderbullet => checkBulletCollideEntity(invaderbullet, s.shield,bulletCollideEntity ) ? invaderbullet: removeChildNode(invaderbullet)).filter(invaderbullet => checkBulletCollideEntity(invaderbullet, s.shield,bulletCollideEntity )),
            endGame: s.invaderbullet.filter( bullet => bulletCollideEntity(bullet, s.tank)).length >=1 && s.lives.length == 0? true : false,
            lives: s.invaderbullet.filter( bullet => bulletCollideEntity(bullet, s.tank)).length == 0 ? s.lives : s.lives.map((element, index) => index == s.lives.length - 1 ? removeChildNode(element): element).filter((element, index) => index < s.lives.length - 1),
            tank:  s.invaderbullet.filter( bullet => bulletCollideEntity(bullet, s.tank)).length == 0 ? s.tank : level1State.tank,
            numOfShield: s.shield.length
          }
        : <State> {
          ...s,
          endGame: false,
          tank: level1State.tank,
          invaders: level1State.invaders,
          tankbullets: s.tankbullets.map( x => removeChildNode(x)).filter( x => false),
          invaderbullet: s.invaderbullet.map( x => removeChildNode(x)).filter( x => false),
          shield: level1State.shield,
          lives: level1State.lives
        }: s
    } 
    // Controls.
	  class Move {
		  constructor(public readonly directionX: number, public readonly directionY: number) {}
	  }
    class Shoot {
		  constructor(public readonly directionX: number, public readonly directionY: number) {}
	  }
    const removeChildNode = (entity: typeEntity) => {
        
      const v = document.getElementById(String(entity.id))
      if(v)
      v.parentNode.removeChild(v) 
      return entity
    }
    const changePicture = (entity: typeEntity, namePic: String) =>{
        return {
          ...entity,
          href: namePic
        } as typeEntity
    }
    const animationforInvader = (entity: typeEntity): typeEntity => entity.x % 60 <= 30 ? (entity.name == 'invader 1' ? changePicture(entity,  'image/a1.jpg') : changePicture(entity,  'image/a5.jpg')) :  
    (entity.name == 'invader 1' ? changePicture(entity,  'image/a2.jpg') : changePicture(entity,  'image/a6.jpg'))
    const getRandomArbitrary = (min:number, max:number):number => Math.floor(Math.random() * (max - min) + min)
    const nextState = (s: State, e: Move | Shoot): State => {
      
      return e instanceof Move ? {
              ...s,
              tank: {
                  ...s.tank,
                  x: s.tank.x + e.directionX,
                  y: s.tank.y + e.directionY,
                   
              },
              shield: s.shield.map(shieldDirection => moveShield(shieldDirection, e.directionX, e.directionY))
          }:
          e instanceof Shoot && s.tankbullets.length < 30?{
            ...s,
            tankbullets: s.tankbullets.concat(createEntity({name:'TankShot', id : "Bullet number " + s.tankbullets.length, x: s.tank.x +20, y: s.tank.y -15, href: 'image/tankshot.png', width: 5, height: 10, xVelocity:e.directionX, yVelocity: e.directionY, visibility: 'visible'} as typeEntity))
          }
          : s.invaders.length == 0 
          ? <State> {
            ...s,
            endGame: false,
            tank: level2State.tank,
            invaders: level2State.invaders,
            tankbullets: s.tankbullets.map( x => removeChildNode(x)).filter( x => false),
            invaderbullet: s.invaderbullet.map( x => removeChildNode(x)).filter( x => false),
           
            shield: level2State.shield,
            level: level2State.level,
            score: level2State.score,
            lives: level2State.lives,
          }  
          :handleCollisions(
          {
            ...s,
            deadInvaders: s.deadInvaders.map(deadInvader => countMove(deadInvader)).map(deadInvader => deadInvader.countMove < 5 ? deadInvader : removeChildNode(deadInvader)).filter(deadInvader => deadInvader.countMove < 5),
            invaders: s.invaders.map( invader => countMove(invader)).map( invader => invader.name != 'UFO' ? (invader.countMove < 100 ? movingObj(invader,'right'): movingObj(invader,'left')) : (invader.countMove < 350 ? ufoMove(invader,'right'): ufoMove(invader,'left'))).map(invader => invader.name != 'UFO' ? animationforInvader(invader): invader),
            tankbullets: s.tankbullets.map( bullet => bullet.y == -30 ? removeChildNode(bullet): bulletMove(bullet)).filter(bullet => bullet.y > -35),
            invaderbullet: s.invaderbullet.concat(s.invaders.filter( invader => ( invader.x*101  + invader.y*37) % s.hardGame == getRandomArbitrary(0,s.hardGame)).map(invader => fastInputCreateInvaderShot(invader.x,invader.y,7,7))).map(invaderbullet => invaderbullet.y > 640? 
              removeChildNode(invaderbullet): bulletMove(invaderbullet)).filter(invaderbullet => invaderbullet.y < 640),
            score: ( 30 - s.invaders.length ) * 10
          } )
    }

    const subscription = interval(20).pipe(merge(up,down,left,right), merge(space),scan(nextState, level1State))
		.subscribe(update);
  
}
  // the following simply runs your pong function on window load.  Make sure to leave it in place.
  if (typeof window != 'undefined')
    window.onload = ()=>{
      spaceinvaders();
    };
  
  
  

