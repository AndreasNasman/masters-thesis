# This shows how to use 
# the glossaries package (http://www.ctan.org/pkg/glossaries)
# the glossaries-extra package (http://www.ctan.org/pkg/glossaries-extra)
# with latexmk.

# 1. If you use the glossaries or the glossaries-extra package, then you use:

   add_cus_dep( 'acn', 'acr', 0, 'makeglossaries' );
   add_cus_dep( 'glo', 'gls', 0, 'makeglossaries' );
   $clean_ext .= " acr acn alg glo gls glg";
   sub makeglossaries {
      my ($base_name, $path) = fileparse( $_[0] );
      pushd $path;
      my $return = system "makeglossaries", $base_name;
      popd;
      return $return;
   }

# source
# https://www.ctan.org/tex-archive/support/latexmk/example_rcfiles