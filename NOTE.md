# 开发记录

最近没少面人，有时候也会问面试者，如何取消一个`Promise`的执行。
这时候，多半都会回答，添加一个变量标识，在回调中判断是否应该继续执行。

大致思路如此没什么问题，但是这是针对某一个`Promise`的。如果有很多个`Promise`，这样的实现未免会变得很繁琐。
所以决定实现一个通用的支持取消的Promise（造轮子走一波）

大致功能为：
1. 普通的`Promise`支持
2. `then`回调签名为三个参数`resolve, reject, cancel`
3. 支持`cancel`回调的监听（`Promise`状态会被改为`reject`）
