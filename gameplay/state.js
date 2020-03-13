function init(newOnState) {
        return false;
}

function start() {
        return true;
}

function end() {
    if(!this.isAlive){
        return false;
    }else{
        return;
    }
}

module.exports = {
    init : init,
    start : start,
    end : end
}