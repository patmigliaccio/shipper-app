<?PHP

$valid_url_regex = '/.*/'; //TODO Add Regex

//TODO Move these to .htpasswd
$apiKey = '{{ API Key }}';
$apiSecret = '{{ API Secret }}';
$user = '{{ username }}';
$pass = '{{ password }}';

$username = $_GET['username'];
$password = $_GET['password'];

if ( !$username ) {

    // Passed username not specified.
    $contents = 'ERROR: username missing';
    $status = array( 'http_code' => 'ERROR' );

} else if ( !$password ) {

    // Passed password not specified.
    $contents = 'ERROR: password missing';
    $status = array( 'http_code' => 'ERROR' );

} else if ( !preg_match( $valid_url_regex, $url ) ) {

    // Passed url doesn't match $valid_url_regex.
    $contents = 'ERROR: invalid url';
    $status = array( 'http_code' => 'ERROR' );

} else {

    if ( $username != $user || $password != $pass ) { // TODO setup a more "real" authentication with .htpasswd
        $contents = 'ERROR: invalid username or password';
        $status = array( 'http_code' => 'ERROR' );
    } else {

        $response = array(
            'success' => True,
            'apiKey' => $apiKey,
            'apiSecret' => $apiSecret
        );

        $contents = json_encode($response);
    }

  echo $contents;
}



?>