"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("tns-core-modules/color");
var shape_enum_1 = require("./shape.enum");
var Shadow = /** @class */ (function () {
    function Shadow() {
    }
    Shadow.apply = function (tnsView, data) {
        if (tnsView.android &&
            android.os.Build.VERSION.SDK_INT >=
                android.os.Build.VERSION_CODES.LOLLIPOP) {
            Shadow.applyOnAndroid(tnsView, Shadow.getDefaults(data));
        }
        else if (tnsView.ios) {
            Shadow.applyOnIOS(tnsView, Shadow.getDefaults(data));
        }
    };
    Shadow.getDefaults = function (data) {
        return Object.assign({}, data, {
            shape: data.shape || Shadow.DEFAULT_SHAPE,
            bgcolor: data.bgcolor || Shadow.DEFAULT_BGCOLOR,
            shadowColor: data.shadowColor ||
                Shadow.DEFAULT_SHADOW_COLOR,
        });
    };
    Shadow.applyOnAndroid = function (tnsView, data) {
        var nativeView = tnsView.android;
        var shape = new android.graphics.drawable.GradientDrawable();
        shape.setShape(android.graphics.drawable.GradientDrawable[data.shape]);
        shape.setColor(android.graphics.Color.parseColor(data.bgcolor));
        shape.setCornerRadius(Shadow.androidDipToPx(nativeView, data.cornerRadius));
        nativeView.setBackgroundDrawable(shape);
        nativeView.setElevation(Shadow.androidDipToPx(nativeView, data.elevation));
        nativeView.setTranslationZ(Shadow.androidDipToPx(nativeView, data.translationZ));
        if (nativeView.getStateListAnimator()) {
            this.overrideDefaultAnimator(nativeView, data);
        }
    };
    Shadow.overrideDefaultAnimator = function (nativeView, data) {
        var sla = new android.animation.StateListAnimator();
        var ObjectAnimator = android.animation.ObjectAnimator;
        var AnimatorSet = android.animation.AnimatorSet;
        var shortAnimTime = android.R.integer.config_shortAnimTime;
        var buttonDuration = nativeView.getContext().getResources().getInteger(shortAnimTime) / 2;
        var pressedElevation = this.androidDipToPx(nativeView, 2);
        var pressedZ = this.androidDipToPx(nativeView, 4);
        var elevation = this.androidDipToPx(nativeView, data.elevation);
        var z = this.androidDipToPx(nativeView, data.translationZ || 0);
        var pressedSet = new AnimatorSet();
        var notPressedSet = new AnimatorSet();
        var defaultSet = new AnimatorSet();
        pressedSet.playTogether(java.util.Arrays.asList([
            ObjectAnimator.ofFloat(nativeView, "translationZ", [pressedZ])
                .setDuration(buttonDuration),
            ObjectAnimator.ofFloat(nativeView, "elevation", [pressedElevation])
                .setDuration(0),
        ]));
        notPressedSet.playTogether(java.util.Arrays.asList([
            ObjectAnimator.ofFloat(nativeView, "translationZ", [z])
                .setDuration(buttonDuration),
            ObjectAnimator.ofFloat(nativeView, "elevation", [elevation])
                .setDuration(0),
        ]));
        defaultSet.playTogether(java.util.Arrays.asList([
            ObjectAnimator.ofFloat(nativeView, "translationZ", [0]).setDuration(0),
            ObjectAnimator.ofFloat(nativeView, "elevation", [0]).setDuration(0),
        ]));
        sla.addState([android.R.attr.state_pressed, android.R.attr.state_enabled], pressedSet);
        sla.addState([android.R.attr.state_enabled], notPressedSet);
        sla.addState([], defaultSet);
        nativeView.setStateListAnimator(sla);
    };
    Shadow.applyOnIOS = function (tnsView, data) {
        var nativeView = tnsView.ios;
        var elevation = parseFloat((data.elevation - 0).toFixed(2));
        nativeView.layer.maskToBounds = false;
        nativeView.layer.shadowColor = new color_1.Color(data.shadowColor).ios.CGColor;
        nativeView.layer.shadowOffset =
            data.shadowOffset ?
                CGSizeMake(0, parseFloat(String(data.shadowOffset))) :
                CGSizeMake(0, 0.54 * elevation - 0.14);
        nativeView.layer.shadowOpacity =
            data.shadowOpacity ?
                parseFloat(String(data.shadowOpacity)) :
                0.006 * elevation + 0.25;
        nativeView.layer.shadowRadius =
            data.shadowRadius ?
                parseFloat(String(data.shadowRadius)) :
                0.66 * elevation - 0.5;
    };
    Shadow.androidDipToPx = function (nativeView, dip) {
        var metrics = nativeView.getContext().getResources().getDisplayMetrics();
        return android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_DIP, dip, metrics);
    };
    Shadow.DEFAULT_SHAPE = shape_enum_1.ShapeEnum.RECTANGLE;
    Shadow.DEFAULT_BGCOLOR = '#FFFFFF';
    Shadow.DEFAULT_SHADOW_COLOR = '#000000';
    return Shadow;
}());
exports.Shadow = Shadow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2hhZG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQStDO0FBSS9DLDJDQUF5QztBQU96QztJQUFBO0lBMkhBLENBQUM7SUF0SFEsWUFBSyxHQUFaLFVBQWEsT0FBWSxFQUFFLElBQTJCO1FBQ3BELEVBQUUsQ0FBQyxDQUNELE9BQU8sQ0FBQyxPQUFPO1lBQ2YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87Z0JBQzlCLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUNuQyxDQUFDLENBQUMsQ0FBQztZQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0gsQ0FBQztJQUVjLGtCQUFXLEdBQTFCLFVBQTJCLElBQTJCO1FBQ3BELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUNsQixFQUFFLEVBQ0YsSUFBSSxFQUNKO1lBQ0UsS0FBSyxFQUFHLElBQW9CLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxhQUFhO1lBQzFELE9BQU8sRUFBRyxJQUFvQixDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsZUFBZTtZQUNoRSxXQUFXLEVBQUcsSUFBZ0IsQ0FBQyxXQUFXO2dCQUN4QyxNQUFNLENBQUMsb0JBQW9CO1NBQzlCLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFYyxxQkFBYyxHQUE3QixVQUE4QixPQUFZLEVBQUUsSUFBaUI7UUFDM0QsSUFBTSxV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QUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUN4QyxHQUFHLEVBQ0gsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBekhNLG9CQUFhLEdBQUcsc0JBQVMsQ0FBQyxTQUFTLENBQUM7SUFDcEMsc0JBQWUsR0FBRyxTQUFTLENBQUM7SUFDNUIsMkJBQW9CLEdBQUcsU0FBUyxDQUFDO0lBd0gxQyxhQUFDO0NBQUEsQUEzSEQsSUEySEM7QUEzSFksd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2xvciB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvY29sb3InO1xuXG5pbXBvcnQgeyBBbmRyb2lkRGF0YSB9IGZyb20gXCIuL2FuZHJvaWQtZGF0YS5tb2RlbFwiO1xuaW1wb3J0IHsgSU9TRGF0YSB9IGZyb20gXCIuL2lvcy1kYXRhLm1vZGVsXCI7XG5pbXBvcnQgeyBTaGFwZUVudW0gfSBmcm9tICcuL3NoYXBlLmVudW0nO1xuXG5kZWNsYXJlIGNvbnN0IGFuZHJvaWQ6IGFueTtcbmRlY2xhcmUgY29uc3QgamF2YTogYW55O1xuZGVjbGFyZSBjb25zdCBDR1NpemVNYWtlOiBhbnk7XG5kZWNsYXJlIGNvbnN0IFVJU2NyZWVuOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBTaGFkb3cge1xuICBzdGF0aWMgREVGQVVMVF9TSEFQRSA9IFNoYXBlRW51bS5SRUNUQU5HTEU7XG4gIHN0YXRpYyBERUZBVUxUX0JHQ09MT1IgPSAnI0ZGRkZGRic7XG4gIHN0YXRpYyBERUZBVUxUX1NIQURPV19DT0xPUiA9ICcjMDAwMDAwJztcblxuICBzdGF0aWMgYXBwbHkodG5zVmlldzogYW55LCBkYXRhOiBJT1NEYXRhIHwgQW5kcm9pZERhdGEpIHtcbiAgICBpZiAoXG4gICAgICB0bnNWaWV3LmFuZHJvaWQgJiZcbiAgICAgIGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49XG4gICAgICAgIGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTl9DT0RFUy5MT0xMSVBPUFxuICAgICkge1xuICAgICAgU2hhZG93LmFwcGx5T25BbmRyb2lkKHRuc1ZpZXcsIFNoYWRvdy5nZXREZWZhdWx0cyhkYXRhKSk7XG4gICAgfSBlbHNlIGlmICh0bnNWaWV3Lmlvcykge1xuICAgICAgU2hhZG93LmFwcGx5T25JT1ModG5zVmlldywgU2hhZG93LmdldERlZmF1bHRzKGRhdGEpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXREZWZhdWx0cyhkYXRhOiBJT1NEYXRhIHwgQW5kcm9pZERhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgZGF0YSxcbiAgICAgIHtcbiAgICAgICAgc2hhcGU6IChkYXRhIGFzIEFuZHJvaWREYXRhKS5zaGFwZSB8fCBTaGFkb3cuREVGQVVMVF9TSEFQRSxcbiAgICAgICAgYmdjb2xvcjogKGRhdGEgYXMgQW5kcm9pZERhdGEpLmJnY29sb3IgfHwgU2hhZG93LkRFRkFVTFRfQkdDT0xPUixcbiAgICAgICAgc2hhZG93Q29sb3I6IChkYXRhIGFzIElPU0RhdGEpLnNoYWRvd0NvbG9yIHx8XG4gICAgICAgICAgU2hhZG93LkRFRkFVTFRfU0hBRE9XX0NPTE9SLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgYXBwbHlPbkFuZHJvaWQodG5zVmlldzogYW55LCBkYXRhOiBBbmRyb2lkRGF0YSkge1xuICAgIGNvbnN0IG5hdGl2ZVZpZXcgPSB0bnNWaWV3LmFuZHJvaWQ7XG4gICAgY29uc3Qgc2hhcGUgPSBuZXcgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5HcmFkaWVudERyYXdhYmxlKCk7XG4gICAgc2hhcGUuc2V0U2hhcGUoXG4gICAgICBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkdyYWRpZW50RHJhd2FibGVbZGF0YS5zaGFwZV0sXG4gICAgKTtcbiAgICBzaGFwZS5zZXRDb2xvcihhbmRyb2lkLmdyYXBoaWNzLkNvbG9yLnBhcnNlQ29sb3IoZGF0YS5iZ2NvbG9yKSk7XG4gICAgc2hhcGUuc2V0Q29ybmVyUmFkaXVzKFxuICAgICAgU2hhZG93LmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEuY29ybmVyUmFkaXVzIGFzIG51bWJlciksXG4gICAgKTtcbiAgICBuYXRpdmVWaWV3LnNldEJhY2tncm91bmREcmF3YWJsZShzaGFwZSk7XG4gICAgbmF0aXZlVmlldy5zZXRFbGV2YXRpb24oXG4gICAgICBTaGFkb3cuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5lbGV2YXRpb24gYXMgbnVtYmVyKSxcbiAgICApO1xuICAgIG5hdGl2ZVZpZXcuc2V0VHJhbnNsYXRpb25aKFxuICAgICAgU2hhZG93LmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEudHJhbnNsYXRpb25aIGFzIG51bWJlciksXG4gICAgKTtcbiAgICBpZiAobmF0aXZlVmlldy5nZXRTdGF0ZUxpc3RBbmltYXRvcigpKSB7XG4gICAgICB0aGlzLm92ZXJyaWRlRGVmYXVsdEFuaW1hdG9yKG5hdGl2ZVZpZXcsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIG92ZXJyaWRlRGVmYXVsdEFuaW1hdG9yKG5hdGl2ZVZpZXc6IGFueSwgZGF0YTogQW5kcm9pZERhdGEpIHtcbiAgICBjb25zdCBzbGEgPSBuZXcgYW5kcm9pZC5hbmltYXRpb24uU3RhdGVMaXN0QW5pbWF0b3IoKTtcblxuICAgIGNvbnN0IE9iamVjdEFuaW1hdG9yID0gYW5kcm9pZC5hbmltYXRpb24uT2JqZWN0QW5pbWF0b3I7XG4gICAgY29uc3QgQW5pbWF0b3JTZXQgICAgPSBhbmRyb2lkLmFuaW1hdGlvbi5BbmltYXRvclNldDtcbiAgICBjb25zdCBzaG9ydEFuaW1UaW1lICA9IGFuZHJvaWQuUi5pbnRlZ2VyLmNvbmZpZ19zaG9ydEFuaW1UaW1lO1xuXG4gICAgY29uc3QgYnV0dG9uRHVyYXRpb24gPVxuICAgICAgbmF0aXZlVmlldy5nZXRDb250ZXh0KCkuZ2V0UmVzb3VyY2VzKCkuZ2V0SW50ZWdlcihzaG9ydEFuaW1UaW1lKSAvIDI7XG4gICAgY29uc3QgcHJlc3NlZEVsZXZhdGlvbiA9IHRoaXMuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgMik7XG4gICAgY29uc3QgcHJlc3NlZFogPSB0aGlzLmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIDQpO1xuICAgIGNvbnN0IGVsZXZhdGlvbiA9IHRoaXMuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5lbGV2YXRpb24pO1xuICAgIGNvbnN0IHogPSB0aGlzLmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEudHJhbnNsYXRpb25aIHx8IDApO1xuXG4gICAgY29uc3QgcHJlc3NlZFNldCA9IG5ldyBBbmltYXRvclNldCgpO1xuICAgIGNvbnN0IG5vdFByZXNzZWRTZXQgPSBuZXcgQW5pbWF0b3JTZXQoKTtcbiAgICBjb25zdCBkZWZhdWx0U2V0ID0gbmV3IEFuaW1hdG9yU2V0KCk7XG5cbiAgICBwcmVzc2VkU2V0LnBsYXlUb2dldGhlcihqYXZhLnV0aWwuQXJyYXlzLmFzTGlzdChbXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwidHJhbnNsYXRpb25aXCIsIFtwcmVzc2VkWl0pXG4gICAgICAgIC5zZXREdXJhdGlvbihidXR0b25EdXJhdGlvbiksXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwiZWxldmF0aW9uXCIsIFtwcmVzc2VkRWxldmF0aW9uXSlcbiAgICAgICAgLnNldER1cmF0aW9uKDApLFxuICAgIF0pKTtcbiAgICBub3RQcmVzc2VkU2V0LnBsYXlUb2dldGhlcihqYXZhLnV0aWwuQXJyYXlzLmFzTGlzdChbXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwidHJhbnNsYXRpb25aXCIsIFt6XSlcbiAgICAgICAgLnNldER1cmF0aW9uKGJ1dHRvbkR1cmF0aW9uKSxcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJlbGV2YXRpb25cIiwgW2VsZXZhdGlvbl0pXG4gICAgICAgIC5zZXREdXJhdGlvbigwKSxcbiAgICBdKSk7XG4gICAgZGVmYXVsdFNldC5wbGF5VG9nZXRoZXIoamF2YS51dGlsLkFycmF5cy5hc0xpc3QoW1xuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcInRyYW5zbGF0aW9uWlwiLCBbMF0pLnNldER1cmF0aW9uKDApLFxuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcImVsZXZhdGlvblwiLCBbMF0pLnNldER1cmF0aW9uKDApLFxuICAgIF0pKTtcblxuICAgIHNsYS5hZGRTdGF0ZShcbiAgICAgIFthbmRyb2lkLlIuYXR0ci5zdGF0ZV9wcmVzc2VkLCBhbmRyb2lkLlIuYXR0ci5zdGF0ZV9lbmFibGVkXSxcbiAgICAgIHByZXNzZWRTZXQsXG4gICAgKTtcbiAgICBzbGEuYWRkU3RhdGUoW2FuZHJvaWQuUi5hdHRyLnN0YXRlX2VuYWJsZWRdLCBub3RQcmVzc2VkU2V0KTtcbiAgICBzbGEuYWRkU3RhdGUoW10sIGRlZmF1bHRTZXQpO1xuICAgIG5hdGl2ZVZpZXcuc2V0U3RhdGVMaXN0QW5pbWF0b3Ioc2xhKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGFwcGx5T25JT1ModG5zVmlldzogYW55LCBkYXRhOiBJT1NEYXRhKSB7XG4gICAgY29uc3QgbmF0aXZlVmlldyA9IHRuc1ZpZXcuaW9zO1xuICAgIGNvbnN0IGVsZXZhdGlvbiA9IHBhcnNlRmxvYXQoKChkYXRhLmVsZXZhdGlvbiBhcyBudW1iZXIpIC0gMCkudG9GaXhlZCgyKSk7XG4gICAgbmF0aXZlVmlldy5sYXllci5tYXNrVG9Cb3VuZHMgPSBmYWxzZTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd0NvbG9yID0gbmV3IENvbG9yKGRhdGEuc2hhZG93Q29sb3IpLmlvcy5DR0NvbG9yO1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93T2Zmc2V0ID1cbiAgICAgIGRhdGEuc2hhZG93T2Zmc2V0ID9cbiAgICAgIENHU2l6ZU1ha2UoMCwgcGFyc2VGbG9hdChTdHJpbmcoZGF0YS5zaGFkb3dPZmZzZXQpKSkgOlxuICAgICAgQ0dTaXplTWFrZSgwLCAwLjU0ICogZWxldmF0aW9uIC0gMC4xNCk7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dPcGFjaXR5ID1cbiAgICAgIGRhdGEuc2hhZG93T3BhY2l0eSA/XG4gICAgICBwYXJzZUZsb2F0KFN0cmluZyhkYXRhLnNoYWRvd09wYWNpdHkpKSA6XG4gICAgICAwLjAwNiAqIGVsZXZhdGlvbiArIDAuMjU7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dSYWRpdXMgPVxuICAgICAgZGF0YS5zaGFkb3dSYWRpdXMgP1xuICAgICAgcGFyc2VGbG9hdChTdHJpbmcoZGF0YS5zaGFkb3dSYWRpdXMpKSA6XG4gICAgICAwLjY2ICogZWxldmF0aW9uIC0gMC41O1xuICB9XG5cbiAgc3RhdGljIGFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXc6IGFueSwgZGlwOiBudW1iZXIpIHtcbiAgICBjb25zdCBtZXRyaWNzID0gbmF0aXZlVmlldy5nZXRDb250ZXh0KCkuZ2V0UmVzb3VyY2VzKCkuZ2V0RGlzcGxheU1ldHJpY3MoKTtcbiAgICByZXR1cm4gYW5kcm9pZC51dGlsLlR5cGVkVmFsdWUuYXBwbHlEaW1lbnNpb24oXG4gICAgICBhbmRyb2lkLnV0aWwuVHlwZWRWYWx1ZS5DT01QTEVYX1VOSVRfRElQLFxuICAgICAgZGlwLFxuICAgICAgbWV0cmljcyxcbiAgICApO1xuICB9XG59XG4iXX0=