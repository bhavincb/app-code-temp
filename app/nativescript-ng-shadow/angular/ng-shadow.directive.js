"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
var shadow_1 = require("../common/shadow");
var NativeShadowDirective = /** @class */ (function () {
    function NativeShadowDirective(el) {
        this.el = el;
        this.loaded = false;
        this.initialized = false;
    }
    NativeShadowDirective.prototype.ngOnInit = function () {
        this.initializeCommonData();
        if (platform_1.isAndroid) {
            this.initializeAndroidData();
        }
        else if (platform_1.isIOS) {
            this.initializeIOSData();
        }
        if (this.shadow && this.shadow.elevation) {
            if (platform_1.isAndroid) {
                this.loadFromAndroidData(this.shadow);
            }
            else if (platform_1.isIOS) {
                this.loadFromIOSData(this.shadow);
            }
        }
        this.applyShadow();
        this.initialized = true;
    };
    NativeShadowDirective.prototype.onLoaded = function () {
        this.loaded = true;
        // Weirdly ngOnInit isn't called on iOS on demo app
        // Managed to get it working on iOS when applying to
        // FlexboxLayout, but on the demo app, we apply to a
        // Label, and, for that case, ngOnInit isn't called
        // This is just enforcing the Directive is initialized
        // before calling this.applyShadow()
        if (!this.initialized) {
            this.ngOnInit();
        }
        this.applyShadow();
    };
    NativeShadowDirective.prototype.ngOnChanges = function (changes) {
        if (this.loaded &&
            !!changes &&
            (changes.hasOwnProperty('shadow') ||
                changes.hasOwnProperty('elevation') ||
                changes.hasOwnProperty('shape') ||
                changes.hasOwnProperty('bgcolor') ||
                changes.hasOwnProperty('cornerRadius') ||
                changes.hasOwnProperty('translationZ') ||
                changes.hasOwnProperty('maskToBounds') ||
                changes.hasOwnProperty('shadowColor') ||
                changes.hasOwnProperty('shadowOffset') ||
                changes.hasOwnProperty('shadowOpacity') ||
                changes.hasOwnProperty('shadowRadius'))) {
            if (changes.hasOwnProperty('shadow') &&
                !changes.hasOwnProperty('elevation') &&
                typeof changes.shadow.currentValue === "number") {
                this.elevation = changes.shadow.currentValue;
            }
            if (changes.shadow && changes.shadow.currentValue.elevation) {
                if (platform_1.isAndroid) {
                    this.loadFromAndroidData(this.shadow);
                }
                else if (platform_1.isIOS) {
                    this.loadFromIOSData(this.shadow);
                }
            }
            this.applyShadow();
        }
    };
    NativeShadowDirective.prototype.applyShadow = function () {
        if (this.shadow === null ||
            this.shadow === undefined ||
            (this.shadow === '' && !this.elevation)) {
            return;
        }
        shadow_1.Shadow.apply(this.el.nativeElement, {
            elevation: this.elevation,
            shape: this.shape,
            bgcolor: this.bgcolor,
            cornerRadius: this.cornerRadius,
            translationZ: this.translationZ,
            maskToBounds: this.maskToBounds,
            shadowColor: this.shadowColor,
            shadowOffset: this.shadowOffset,
            shadowOpacity: this.shadowOpacity,
            shadowRadius: this.shadowRadius,
        });
    };
    NativeShadowDirective.prototype.initializeCommonData = function () {
        var tShadow = typeof this.shadow;
        if ((tShadow === 'string' || tShadow === 'number') && !this.elevation) {
            this.elevation = this.shadow ?
                parseInt(this.shadow, 10) : 2;
        }
        var tElevation = typeof this.elevation;
        if (tElevation === 'string' || tElevation === 'number') {
            this.elevation = this.elevation ?
                parseInt(this.elevation, 10) : 2;
        }
    };
    NativeShadowDirective.prototype.initializeAndroidData = function () {
        if (typeof this.cornerRadius === 'string') {
            this.cornerRadius = parseInt(this.cornerRadius, 10);
        }
        if (typeof this.translationZ === 'string') {
            this.translationZ = parseInt(this.translationZ, 10);
        }
    };
    NativeShadowDirective.prototype.initializeIOSData = function () {
        if (typeof this.shadowOffset === 'string') {
            this.shadowOffset = parseFloat(this.shadowOffset);
        }
        if (typeof this.shadowOpacity === 'string') {
            this.shadowOpacity = parseFloat(this.shadowOpacity);
        }
        if (typeof this.shadowRadius === 'string') {
            this.shadowRadius = parseFloat(this.shadowRadius);
        }
    };
    NativeShadowDirective.prototype.loadFromAndroidData = function (data) {
        this.elevation = data.elevation || this.elevation;
        this.shape = data.shape || this.shape;
        this.bgcolor = data.bgcolor || this.bgcolor;
        this.cornerRadius = data.cornerRadius || this.cornerRadius;
        this.translationZ = data.translationZ || this.translationZ;
    };
    NativeShadowDirective.prototype.loadFromIOSData = function (data) {
        this.maskToBounds = data.maskToBounds || this.maskToBounds;
        this.shadowColor = data.shadowColor || this.shadowColor;
        this.shadowOffset = data.shadowOffset || this.shadowOffset;
        this.shadowOpacity = data.shadowOpacity || this.shadowOpacity;
        this.shadowRadius = data.shadowRadius || this.shadowRadius;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "shadow", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "elevation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NativeShadowDirective.prototype, "shape", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NativeShadowDirective.prototype, "bgcolor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "cornerRadius", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "translationZ", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NativeShadowDirective.prototype, "maskToBounds", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NativeShadowDirective.prototype, "shadowColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "shadowOffset", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "shadowOpacity", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NativeShadowDirective.prototype, "shadowRadius", void 0);
    __decorate([
        core_1.HostListener('loaded'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NativeShadowDirective.prototype, "onLoaded", null);
    NativeShadowDirective = __decorate([
        core_1.Directive({ selector: '[shadow]' }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], NativeShadowDirective);
    return NativeShadowDirective;
}());
exports.NativeShadowDirective = NativeShadowDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2hhZG93LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nLXNoYWRvdy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FDd0U7QUFDeEUsc0RBQTZEO0FBSTdELDJDQUEwQztBQUkxQztJQWdCRSwrQkFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFIMUIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGdCQUFXLEdBQUcsS0FBSyxDQUFDO0lBRVMsQ0FBQztJQUV0Qyx3Q0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsb0JBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFLLElBQUksQ0FBQyxNQUFnQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsRUFBRSxDQUFDLENBQUMsb0JBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFxQixDQUFDLENBQUM7WUFDdkQsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBSyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBaUIsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFHRCx3Q0FB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dGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lcixcbiAgICAgICAgIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNBbmRyb2lkLCBpc0lPUyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm0nO1xuXG5pbXBvcnQgeyBBbmRyb2lkRGF0YSB9IGZyb20gJy4uL2NvbW1vbi9hbmRyb2lkLWRhdGEubW9kZWwnO1xuaW1wb3J0IHsgSU9TRGF0YSB9IGZyb20gJy4uL2NvbW1vbi9pb3MtZGF0YS5tb2RlbCc7XG5pbXBvcnQgeyBTaGFkb3cgfSBmcm9tICcuLi9jb21tb24vc2hhZG93JztcbmltcG9ydCB7IFNoYXBlLCBTaGFwZUVudW0gfSBmcm9tICcuLi9jb21tb24vc2hhcGUuZW51bSc7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tzaGFkb3ddJyB9KVxuZXhwb3J0IGNsYXNzIE5hdGl2ZVNoYWRvd0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgc2hhZG93OiBzdHJpbmcgfCBBbmRyb2lkRGF0YSB8IElPU0RhdGE7XG4gIEBJbnB1dCgpIGVsZXZhdGlvbj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgc2hhcGU/OiBTaGFwZTtcbiAgQElucHV0KCkgYmdjb2xvcj86IHN0cmluZztcbiAgQElucHV0KCkgY29ybmVyUmFkaXVzPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSB0cmFuc2xhdGlvblo/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIG1hc2tUb0JvdW5kcz86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNoYWRvd0NvbG9yPzogc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dPZmZzZXQ/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHNoYWRvd09wYWNpdHk/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHNoYWRvd1JhZGl1cz86IG51bWJlciB8IHN0cmluZztcblxuICBwcml2YXRlIGxvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVDb21tb25EYXRhKCk7XG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgdGhpcy5pbml0aWFsaXplQW5kcm9pZERhdGEoKTtcbiAgICB9IGVsc2UgaWYgKGlzSU9TKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVJT1NEYXRhKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNoYWRvdyAmJiAodGhpcy5zaGFkb3cgYXMgQW5kcm9pZERhdGEgfCBJT1NEYXRhKS5lbGV2YXRpb24pIHtcbiAgICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgICAgdGhpcy5sb2FkRnJvbUFuZHJvaWREYXRhKHRoaXMuc2hhZG93IGFzIEFuZHJvaWREYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgdGhpcy5sb2FkRnJvbUlPU0RhdGEodGhpcy5zaGFkb3cgYXMgSU9TRGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2xvYWRlZCcpXG4gIG9uTG9hZGVkKCkge1xuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAvLyBXZWlyZGx5IG5nT25Jbml0IGlzbid0IGNhbGxlZCBvbiBpT1Mgb24gZGVtbyBhcHBcbiAgICAvLyBNYW5hZ2VkIHRvIGdldCBpdCB3b3JraW5nIG9uIGlPUyB3aGVuIGFwcGx5aW5nIHRvXG4gICAgLy8gRmxleGJveExheW91dCwgYnV0IG9uIHRoZSBkZW1vIGFwcCwgd2UgYXBwbHkgdG8gYVxuICAgIC8vIExhYmVsLCBhbmQsIGZvciB0aGF0IGNhc2UsIG5nT25Jbml0IGlzbid0IGNhbGxlZFxuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGVuZm9yY2luZyB0aGUgRGlyZWN0aXZlIGlzIGluaXRpYWxpemVkXG4gICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcy5hcHBseVNoYWRvdygpXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLm5nT25Jbml0KCk7XG4gICAgfVxuICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmxvYWRlZCAmJlxuICAgICAgISFjaGFuZ2VzICYmXG4gICAgICAoXG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvdycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2VsZXZhdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYXBlJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnYmdjb2xvcicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Nvcm5lclJhZGl1cycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RyYW5zbGF0aW9uWicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ21hc2tUb0JvdW5kcycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvd0NvbG9yJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93T2Zmc2V0JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93T3BhY2l0eScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvd1JhZGl1cycpXG4gICAgICApXG4gICAgKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvdycpICYmXG4gICAgICAgICFjaGFuZ2VzLmhhc093blByb3BlcnR5KCdlbGV2YXRpb24nKSAmJlxuICAgICAgICB0eXBlb2YgY2hhbmdlcy5zaGFkb3cuY3VycmVudFZhbHVlID09PSBcIm51bWJlclwiXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZWxldmF0aW9uID0gY2hhbmdlcy5zaGFkb3cuY3VycmVudFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXMuc2hhZG93ICYmIGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZS5lbGV2YXRpb24pIHtcbiAgICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21BbmRyb2lkRGF0YSh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSU9TRGF0YSh0aGlzLnNoYWRvdyBhcyBJT1NEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hcHBseVNoYWRvdygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlTaGFkb3coKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zaGFkb3cgPT09IG51bGwgfHxcbiAgICAgIHRoaXMuc2hhZG93ID09PSB1bmRlZmluZWQgfHxcbiAgICAgICh0aGlzLnNoYWRvdyA9PT0gJycgJiYgIXRoaXMuZWxldmF0aW9uKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFNoYWRvdy5hcHBseShcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgIHtcbiAgICAgICAgZWxldmF0aW9uOiAodGhpcy5lbGV2YXRpb24gYXMgbnVtYmVyKSxcbiAgICAgICAgc2hhcGU6IHRoaXMuc2hhcGUsXG4gICAgICAgIGJnY29sb3I6IHRoaXMuYmdjb2xvcixcbiAgICAgICAgY29ybmVyUmFkaXVzOiB0aGlzLmNvcm5lclJhZGl1cyxcbiAgICAgICAgdHJhbnNsYXRpb25aOiB0aGlzLnRyYW5zbGF0aW9uWixcbiAgICAgICAgbWFza1RvQm91bmRzOiB0aGlzLm1hc2tUb0JvdW5kcyxcbiAgICAgICAgc2hhZG93Q29sb3I6IHRoaXMuc2hhZG93Q29sb3IsXG4gICAgICAgIHNoYWRvd09mZnNldDogKHRoaXMuc2hhZG93T2Zmc2V0IGFzIG51bWJlciksXG4gICAgICAgIHNoYWRvd09wYWNpdHk6ICh0aGlzLnNoYWRvd09wYWNpdHkgYXMgbnVtYmVyKSxcbiAgICAgICAgc2hhZG93UmFkaXVzOiAodGhpcy5zaGFkb3dSYWRpdXMgYXMgbnVtYmVyKSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUNvbW1vbkRhdGEoKSB7XG4gICAgY29uc3QgdFNoYWRvdyA9IHR5cGVvZiB0aGlzLnNoYWRvdztcbiAgICBpZiAoKHRTaGFkb3cgPT09ICdzdHJpbmcnIHx8IHRTaGFkb3cgPT09ICdudW1iZXInKSAmJiAhdGhpcy5lbGV2YXRpb24pIHtcbiAgICAgIHRoaXMuZWxldmF0aW9uID0gdGhpcy5zaGFkb3cgP1xuICAgICAgICBwYXJzZUludCh0aGlzLnNoYWRvdyBhcyBzdHJpbmcsIDEwKSA6IDI7XG4gICAgfVxuICAgIGNvbnN0IHRFbGV2YXRpb24gPSB0eXBlb2YgdGhpcy5lbGV2YXRpb247XG4gICAgaWYgKHRFbGV2YXRpb24gPT09ICdzdHJpbmcnIHx8IHRFbGV2YXRpb24gPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLmVsZXZhdGlvbiA9IHRoaXMuZWxldmF0aW9uID9cbiAgICAgICAgcGFyc2VJbnQodGhpcy5lbGV2YXRpb24gYXMgc3RyaW5nLCAxMCkgOiAyO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUFuZHJvaWREYXRhKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jb3JuZXJSYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmNvcm5lclJhZGl1cyA9IHBhcnNlSW50KHRoaXMuY29ybmVyUmFkaXVzLCAxMCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy50cmFuc2xhdGlvblogPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0aW9uWiA9IHBhcnNlSW50KHRoaXMudHJhbnNsYXRpb25aLCAxMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplSU9TRGF0YSgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2hhZG93T2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zaGFkb3dPZmZzZXQgPSBwYXJzZUZsb2F0KHRoaXMuc2hhZG93T2Zmc2V0KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNoYWRvd09wYWNpdHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd09wYWNpdHkgPSBwYXJzZUZsb2F0KHRoaXMuc2hhZG93T3BhY2l0eSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5zaGFkb3dSYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd1JhZGl1cyA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dSYWRpdXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZEZyb21BbmRyb2lkRGF0YShkYXRhOiBBbmRyb2lkRGF0YSkge1xuICAgIHRoaXMuZWxldmF0aW9uID0gZGF0YS5lbGV2YXRpb24gfHwgdGhpcy5lbGV2YXRpb247XG4gICAgdGhpcy5zaGFwZSA9IGRhdGEuc2hhcGUgfHwgdGhpcy5zaGFwZTtcbiAgICB0aGlzLmJnY29sb3IgPSBkYXRhLmJnY29sb3IgfHwgdGhpcy5iZ2NvbG9yO1xuICAgIHRoaXMuY29ybmVyUmFkaXVzID0gZGF0YS5jb3JuZXJSYWRpdXMgfHwgdGhpcy5jb3JuZXJSYWRpdXM7XG4gICAgdGhpcy50cmFuc2xhdGlvblogPSBkYXRhLnRyYW5zbGF0aW9uWiB8fCB0aGlzLnRyYW5zbGF0aW9uWjtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZEZyb21JT1NEYXRhKGRhdGE6IElPU0RhdGEpIHtcbiAgICB0aGlzLm1hc2tUb0JvdW5kcyA9IGRhdGEubWFza1RvQm91bmRzIHx8IHRoaXMubWFza1RvQm91bmRzO1xuICAgIHRoaXMuc2hhZG93Q29sb3IgPSBkYXRhLnNoYWRvd0NvbG9yIHx8IHRoaXMuc2hhZG93Q29sb3I7XG4gICAgdGhpcy5zaGFkb3dPZmZzZXQgPSBkYXRhLnNoYWRvd09mZnNldCB8fCB0aGlzLnNoYWRvd09mZnNldDtcbiAgICB0aGlzLnNoYWRvd09wYWNpdHkgPSBkYXRhLnNoYWRvd09wYWNpdHkgfHwgdGhpcy5zaGFkb3dPcGFjaXR5O1xuICAgIHRoaXMuc2hhZG93UmFkaXVzID0gZGF0YS5zaGFkb3dSYWRpdXMgfHwgdGhpcy5zaGFkb3dSYWRpdXM7XG4gIH1cbn1cbiJdfQ==