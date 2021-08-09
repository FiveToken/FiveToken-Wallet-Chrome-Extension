<template>
    <div class="wrap">
        <canvas id="mycanvas"></canvas>
    </div>
</template>

<script>
//position为坐标的封装类
class position {
    constructor(x = null, y = null) {
        this._x = x;
        this._y = y;
    }
    init() {
        this.x = Math.floor(Math.random() * 5);
        this.y = Math.floor(Math.random() * 5);
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }
}
//quarter为单位三角形的坐标类
class quarter {
    constructor(a, b, c) {
        this._a = a;
        this._b = b;
        this._c = c;
    }
    get a() {
        return this._a;
    }
    get b() {
        return this._b;
    }
    get c() {
        return this._c;
    }
    set a(a) {
        return this._a = a;
    }
    set b(b) {
        return this._b = b;
    }
    set c(c) {
        return this._c = c;
    }
}
export default {
  data() {
    return { };
  },
  mounted(){ 
      this.drawAvatar('mycanvas')
  },
  methods: {
    //生成图形的坐标
    generatorMap() {
        let a = new position().init();
        let b = new position().init();
        let c = new position().init();
        return new quarter(a, b, c);
    },
    //绘画
    drawAvatar(canvasId) {
        var canvas = document.getElementById(canvasId);
        //初始化canvas设置
        canvas.width = 800;
        canvas.height = 800;
        var ctx = canvas.getContext('2d');
        //头像背景颜色设置
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //设置头像颜色
        var colors = [
            "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
            "#f1c40f", "#e67e22", "#e74c3c", "#00bcd4", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
        ];
        ctx.fillStyle = colors[Math.floor((Math.random() * colors.length))];
        ctx.translate(400, 400);
        for (let i = 1; i <= 4; i++) {
            let quarter = this.generatorMap();
            let a, b, c;
            a = this.caculateP(quarter.a, i);
            b = this.caculateP(quarter.b, i);
            c = this.caculateP(quarter.c, i);
            for (var j = 0; j < 4; j++) { // draw individual dots
                ctx.rotate(Math.PI*2/4);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.lineTo(c.x, c.y);
                ctx.fill();
            }
        }
        canvas.toDataURL("image/png");
    },
    caculateP(position, i) {
        var step = 50;
        position.x = (i % 2 == 1 ? 0 : 1) * 4 * step + position.x * step;
        position.y = (i <= 2 ? 0 : 1) * 4 * step + position.y * step;
        console.log(position.x, position.y);
        return position;
    }
  },
};
</script>

<style  lang="less" scoped>

</style>