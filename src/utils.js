function generateId(){
  return (1+Math.random()*4294967295).toString(16);
}

module.exports = {
	generateId: generateId
}