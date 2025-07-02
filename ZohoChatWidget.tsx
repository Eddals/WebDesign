import React from "react";

const ZohoChatWidget: React.FC = () => (
  <>
    <script
      dangerouslySetInnerHTML={{
        __html:
          'window.$zoho=window.$zoho || {}; $zoho.salesiq=$zoho.salesiq||{ready:function(){}}',
      }}
    />
    <script
      id="zsiqscript"
      src="https://salesiq.zohopublic.com/widget?wc=siqd35609490db12740e1dffb562df59d10622e036ba3492f47cbe1a97daa56a515"
      defer
    />
  </>
);

export default ZohoChatWidget;
