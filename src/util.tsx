import { SWIPE, DIRECTION_NONE, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_DOWN } from './config';

function _calcTriangleDistance(x, y) {
  return Math.sqrt(x * x + y * y);
}

function _calcAngle (x, y) {
  const radian = Math.atan2(y, x);
  return 180 / (Math.PI / radian);
}

export function now() {
  return Date.now();
}

export function calcMutliFingerStatus(touches) {
  if (touches.length < 2) {
    return;
  }
  const { x: x1, y: y1 } = touches[0];
  const { x: x2, y: y2 } = touches[1];
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return {
    x: deltaX,
    y: deltaY,
    z: _calcTriangleDistance(deltaX, deltaY),
    angle: _calcAngle(deltaX, deltaY),
  };
}

export function calcMoveStatus(startTouches, touches, time) {
  const { moveStatus: preMoveStatus } = this.gesture;
  const { x: x1, y: y1 } = startTouches[0];
  const { x: x2, y: y2 } = touches[0];
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const deltaZ = _calcTriangleDistance(deltaX, deltaY);
  return {
    x: deltaX,
    y: deltaY,
    z: deltaZ,
    time,
    velocity: deltaZ / time,
    angle: _calcAngle(deltaX, deltaY),
    haveBeenMoveBack: preMoveStatus && Math.abs(deltaZ) < Math.abs(preMoveStatus.z),
  };
}
export function calcRotation(startMutliFingerStatus, mutliFingerStatus) {
  const { angle: startAngle } = startMutliFingerStatus;
  const { angle } = mutliFingerStatus;

  return angle - startAngle;
}

export function getEventName(prefix, status) {
  return prefix + status[0].toUpperCase() + status.slice(1);
}

export function shouldTriggerSwipe(delta, velocity) {
  return Math.abs(delta) >= SWIPE.threshold && Math.abs(velocity) > SWIPE.velocity;
}

/**
 * @private
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
export function getDirection(x, y) {
  if (x === y) {
    return DIRECTION_NONE;
  }

  if (Math.abs(x) >= Math.abs(y)) {
    return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }
  return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

export function getDirectionEventName(direction) {
  let name;
  switch (direction) {
    case DIRECTION_NONE:
      break;
    case DIRECTION_LEFT:
      name = 'left';
      break;
    case DIRECTION_RIGHT:
      name = 'right';
      break;
    case DIRECTION_UP:
      name = 'up';
      break;
    case DIRECTION_DOWN:
      name = 'down';
      break;
    default:
  }
  return name;
}
