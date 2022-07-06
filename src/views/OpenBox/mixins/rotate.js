import { Timeout } from "@/utils/mixin";
export default {
    methods: {
        Rotate() {
            if (!this.canRotate) return;
            this.canRotate = false;
            this.RotateStart();
        },
        async RotateStart() {
            this.dur = 5000;
            this.pos = this.width * (this.num - 10)//- (Math.random() - 0.5) * (this.width - 2);
            await this.RotateEnd();
        },
        async RotateEnd() {
            await Timeout(5500);
            this.dur = 0;
            this.pos = 0
            for (let i = 0; i < 6; i++)
                this.list[i] = this.list[this.num - 10 + i];
            this.canRotate = true;
        }
    },
};