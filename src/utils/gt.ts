// "v0.4.8 Geetest Inc.";

(function (window: Window) {
  "use strict";
  if (typeof window === "undefined") {
    throw new Error("Geetest requires browser environment");
  }

  const document = window.document;
  const Math = window.Math;
  const head = document.getElementsByTagName("head")[0];

  class _Object {
    private _obj: { [key: string]: any };

    constructor(obj: { [key: string]: any }) {
      this._obj = obj;
    }

    _each(process: (key: string, value: any) => void): _Object {
      const _obj = this._obj;
      for (const k in _obj) {
        if (_obj.hasOwnProperty(k)) {
          process(k, _obj[k]);
        }
      }
      return this;
    }
  }

  class Config {
    [key: string]: any;

    api_server: string = "api.geetest.com";
    protocol: string = "http://";
    typePath: string = "/gettype.php";
    fallback_config: any = {
      slide: {
        static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
        type: "slide",
        slide: "/static/js/geetest.0.0.0.js",
      },
      fullpage: {
        static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
        type: "fullpage",
        fullpage: "/static/js/fullpage.0.0.0.js",
      },
    };

    constructor(config: { [key: string]: any }) {
      this._extend(config);
    }

    _get_fallback_config(): any {
      if (isString(this.type)) {
        return this.fallback_config[this.type];
      } else if (this.new_captcha) {
        return this.fallback_config.fullpage;
      } else {
        return this.fallback_config.slide;
      }
    }

    _extend(obj: { [key: string]: any }): void {
      new _Object(obj)._each((key: string, value: any) => {
        this[key] = value;
      });
    }
  }

  const isNumber = function (value: any): value is number {
    return typeof value === "number";
  };

  const isString = function (value: any): value is string {
    return typeof value === "string";
  };

  const isBoolean = function (value: any): value is boolean {
    return typeof value === "boolean";
  };

  const isObject = function (value: any): value is object {
    return typeof value === "object" && value !== null;
  };

  const isFunction = function (value: any): value is Function {
    return typeof value === "function";
  };

  const MOBILE = /Mobi/i.test(navigator.userAgent);
  const pt = MOBILE ? 3 : 0;

  const callbacks: { [key: string]: Function[] } = {};
  const status: { [key: string]: string } = {};

  const nowDate = function (): string {
    const date = new Date();
    const year = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    let day: number | string = date.getDate();
    let hours: number | string = date.getHours();
    let minutes: number | string = date.getMinutes();
    let seconds: number | string = date.getSeconds();

    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    const currentdate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return currentdate;
  };

  const random = function (): number {
    return parseInt((Math.random() * 10000).toString()) + new Date().valueOf();
  };

  const loadScript = function (url: string, cb: (err: boolean) => void): void {
    const script = document.createElement("script");
    script.charset = "UTF-8";
    script.async = true;

    // 对 geetest 的静态资源添加 crossOrigin
    if (/static\.geetest\.com/g.test(url)) {
      script.crossOrigin = "anonymous";
    }

    script.onerror = function () {
      cb(true);
    };
    let loaded = false;
    script.onload = script.onreadystatechange = function () {
      if (
        !loaded &&
        (!script.readyState ||
          script.readyState === "loaded" ||
          script.readyState === "complete")
      ) {
        loaded = true;
        setTimeout(function () {
          cb(false);
        }, 0);
      }
    };
    script.src = url;
    head.appendChild(script);
  };

  const normalizeDomain = function (domain: string): string {
    // special domain: uems.sysu.edu.cn/jwxt/geetest/
    // return domain.replace(/^https?:\/\/|\/.*$/g, ''); uems.sysu.edu.cn
    return domain.replace(/^https?:\/\/|\/$/g, ""); // uems.sysu.edu.cn/jwxt/geetest
  };

  const normalizePath = function (path: string): string {
    path = path.replace(/\/+/g, "/");
    if (path.indexOf("/") !== 0) {
      path = "/" + path;
    }
    return path;
  };

  const normalizeQuery = function (query: { [key: string]: any }): string {
    if (!query) {
      return "";
    }
    let q = "?";
    new _Object(query)._each(function (key: string, value: any) {
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        q = q + encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
    });
    if (q === "?") {
      q = "";
    }
    return q.replace(/&$/, "");
  };

  const makeURL = function (
    protocol: string,
    domain: string,
    path: string,
    query: { [key: string]: any }
  ): string {
    domain = normalizeDomain(domain);

    let url = normalizePath(path) + normalizeQuery(query);
    if (domain) {
      url = protocol + domain + url;
    }

    return url;
  };

  const load = function (
    config: any,
    send: boolean,
    protocol: string,
    domains: string[],
    path: string,
    query: { [key: string]: any },
    cb: (err: boolean) => void
  ): void {
    const tryRequest = function (at: number) {
      const url = makeURL(protocol, domains[at], path, query);
      loadScript(url, function (err: boolean) {
        if (err) {
          if (at >= domains.length - 1) {
            cb(true);
            // report gettype error
            if (send) {
              config.error_code = 508;
              const url = protocol + domains[at] + path;
              reportError(config, url);
            }
          } else {
            tryRequest(at + 1);
          }
        } else {
          cb(false);
        }
      });
    };
    tryRequest(0);
  };

  const jsonp = function (
    domains: string[],
    path: string,
    config: any,
    callback: (data: any) => void
  ): void {
    if (isObject(config.getLib)) {
      config._extend(config.getLib);
      callback(config);
      return;
    }
    if (config.offline) {
      callback(config._get_fallback_config());
      return;
    }

    const cb = "geetest_" + random();
    (window as any)[cb] = function (data: any) {
      if (data.status === "success") {
        callback(data.data);
      } else if (!data.status) {
        callback(data);
      } else {
        callback(config._get_fallback_config());
      }
      (window as any)[cb] = undefined;
      try {
        delete (window as any)[cb];
      } catch (e) {}
    };
    load(
      config,
      true,
      config.protocol,
      domains,
      path,
      {
        gt: config.gt,
        callback: cb,
      },
      function (err: boolean) {
        if (err) {
          callback(config._get_fallback_config());
        }
      }
    );
  };

  const reportError = function (config: any, url: string): void {
    load(
      config,
      false,
      config.protocol,
      ["monitor.geetest.com"],
      "/monitor/send",
      {
        time: nowDate(),
        captcha_id: config.gt,
        challenge: config.challenge,
        pt: pt,
        exception_url: url,
        error_code: config.error_code,
      },
      function (err: boolean) {}
    );
  };

  const throwError = function (errorType: string, config: any): void {
    const errors: { [key: string]: string } = {
      networkError: "网络错误",
      gtTypeError: "gt字段不是字符串类型",
    };
    if (typeof config.onError === "function") {
      config.onError(errors[errorType]);
    } else {
      throw new Error(errors[errorType]);
    }
  };

  const detect = function (): any {
    return (window as any).Geetest || document.getElementById("gt_lib");
  };

  if (detect()) {
    status.slide = "loaded";
  }

  (window as any).initGeetest = function (
    userConfig: any,
    callback: (captchaObj: any) => void
  ): void {
    const config = new Config(userConfig);

    if (userConfig.https) {
      config.protocol = "https://";
    } else if (!userConfig.protocol) {
      config.protocol = window.location.protocol + "//";
    }

    // for KFC
    if (
      userConfig.gt === "050cffef4ae57b5d5e529fea9540b0d1" ||
      userConfig.gt === "3bd38408ae4af923ed36e13819b14d42"
    ) {
      config.apiserver = "yumchina.geetest.com/"; // for old js
      config.api_server = "yumchina.geetest.com";
    }

    if (userConfig.gt) {
      (window as any).GeeGT = userConfig.gt;
    }

    if (userConfig.challenge) {
      (window as any).GeeChallenge = userConfig.challenge;
    }

    if (isObject(userConfig.getType)) {
      config._extend(userConfig.getType);
    }
    jsonp(
      [config.api_server || config.apiserver],
      config.typePath,
      config,
      function (newConfig: any) {
        const type = newConfig.type;
        const init = function () {
          config._extend(newConfig);
          callback(new (window as any).Geetest(config));
        };

        callbacks[type] = callbacks[type] || [];
        const s = status[type] || "init";
        if (s === "init") {
          status[type] = "loading";

          callbacks[type].push(init);

          load(
            config,
            true,
            config.protocol,
            newConfig.static_servers || newConfig.domains,
            newConfig[type] || newConfig.path,
            null,
            function (err: boolean) {
              if (err) {
                status[type] = "fail";
                throwError("networkError", config);
              } else {
                status[type] = "loaded";
                const cbs = callbacks[type];
                for (let i = 0, len = cbs.length; i < len; i = i + 1) {
                  const cb = cbs[i];
                  if (isFunction(cb)) {
                    cb();
                  }
                }
                callbacks[type] = [];
              }
            }
          );
        } else if (s === "loaded") {
          init();
        } else if (s === "fail") {
          throwError("networkError", config);
        } else if (s === "loading") {
          callbacks[type].push(init);
        }
      }
    );
  };
})(window);
