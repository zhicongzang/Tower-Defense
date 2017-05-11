var TD = {

	col: Profiles.map_col_size,
	row: Profiles.map_row_size,
	blockSize: Profiles.getBlockSize(),
	lineWidth: Profiles.getLineWidth(),
	stepTime: Profiles.default_step_time,
	expFPS: Profiles.default_fps,
	deltaFPS: Profiles.delta_fps,

	map: null,
	scene: null,
	eventManager: null,

	frame: 0,
	fps: 0,

	lastFrameTime: null,
	st: null,
	isPaused: true,

	init: function(div) {
		// Once init, delete init function
		delete this.init;
		// Create map canvas
		canvas = document.createElement('canvas'); 
		canvas.id = "TD"; 
		canvas.width  = this.col * this.blockSize; 
		canvas.height = this.row * this.blockSize; 
		canvas.style.zIndex   = 99; 
		canvas.style.position = "absolute"; 
		canvas.style.border   = "1px solid";
		div.append(canvas);
		this.eventManager = new EventManager();
		this.scene = new Scene(canvas);
		BlockFactory.setup(this.scene, this.eventManager);
		TowerFactory.setup(this.scene, this.eventManager);
		MonsterFactory.setup(this.scene);
		BulletFactory.setup(this.scene, this.eventManager);
		this.map = new Map({}, this.eventManager);
		Popup.init(this.scene, this.eventManager);
		this.start();
	},
	start: function() {
		clearTimeout(this.st)
		this.frame = 0;
		this.isPaused = false;
		this.lastFrameTime = (new Date()).getTime();
		var canvas = document.getElementById("TD");
		var eventManager = this.eventManager;
		$("#TD").on("click", function(e) {
			var position = Utils.getMousePos(canvas, e);
			eventManager.click(position.x, position.y);
		});
		$("#TD").on("mousemove", function(e) {
			var position = Utils.getMousePos(canvas, e);
			eventManager.hover(position.x, position.y);
		});
		this.scene.start();
		this.step();
	},
	step: function() {
		if (this.isPaused) {
			return;
		}
		this.frame += 1;
		if (this.frame % 25 == 0) {
			var t = (new Date()).getTime();
			var stepTime = this.stepTime;
			this.fps = Math.round(250000 / (t - this.lastFrameTime)) / 10;
			this.lastFrameTime = t;
			if (this.fps < this.expFPS - this.deltaFPS && stepTime > 1) {
				stepTime -= 1;
			} else if (this.fps > this.expFPS + this.deltaFPS) {
				stepTime += 1;
			}
			this.stepTime = stepTime;
		}
		// Catch event
		this.eventManager.step();
		// Update Element
		this.map.step();
		// Update view
		this.scene.step();
		this.st = setTimeout(function() {
			TD.step();
		}, this.stepTime);
	}
}