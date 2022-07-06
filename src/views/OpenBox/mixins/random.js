export default {
    methods: {
        //随机生成奖品列表
        GetList(k) {
            let arr = [];
            if (this.data.length < 1) return arr;
            // console.log(this.data)
            if (this.data.length == 2) {
                if (this.awards.length >= k && this.awards[0].name == "廉价物品") {
                    for (let i = 0; i < this.num; i++) {
                        this.list[i] = this.data[i % 2];
                    }
                } else {
                    for (let i = 0; i < this.num; i++) {
                        this.list[i] = this.data[1 - i % 2];
                    }
                }
                for (let i = 0; i < this.list.length; i++) arr[i] = this.list[i];
                return arr;
            } else {
                for (let i = 0; i < this.num; i++) {
                    const ran = Math.random() * (this.data.length - 1);
                    const index = Math.round(ran);
                    this.list[i] = this.data[index];
                }
                for (let i = 0; i < this.list.length; i++) arr[i] = this.list[i];
                if (this.awards.length >= k)
                    arr[this.num - 7] = this.awards[k - 1]
                return arr;
            }
        },
    },
};