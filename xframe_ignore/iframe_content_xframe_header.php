<?php

if (isset($_GET['x-frame-options'])) {
  header('x-frame-options: deny', false /* replace */);
  header('X-FRAME-OPTIONS: deny', false /* replace */);
  header('X-Frame-Options: deny', false /* replace */);
}
if (isset($_GET['content-security-policy'])) {
  header("content-security-policy: child-src 'none';", false /* replace */);
  header("CONTENT-SECURITY-POLICY: child-src 'none';", false /* replace */);
  header("Content-Security-Policy: child-src 'none';", false /* replace */);
}
?>
<html>
<body>
  iframe content - iframe_content_xframe_header.php

  <p><?php echo htmlspecialchars($_SERVER['QUERY_STRING']); ?>

  <p>nested iframe: <iframe src="README.md" width="250" height="50"></iframe>
</body>
